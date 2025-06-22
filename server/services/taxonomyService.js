const TaxonomyCache = require("../models/TaxonomyCache");
const axios = require("axios");
const xml2js = require("xml2js");

class TaxonomyService {
	constructor() {
		this.parser = new xml2js.Parser({ explicitArray: false });
	}

	/**
	 * Get order by taxId with cache-first strategy
	 * 1. Check MongoDB cache
	 * 2. If not found, fetch from E-utilities API and cache
	 */
	async getOrderByTaxId(taxId) {
		// Step 1: Check MongoDB cache first
		const cached = await TaxonomyCache.findOne({ taxId: taxId.toString() });
		if (cached && cached.order) {
			console.log(`📋 Cache hit for taxId ${taxId}: ${cached.order}`);
			return cached.order;
		}

		// Step 2: If not in cache, fetch from API
		console.log(`🔍 Cache miss for taxId ${taxId}, fetching from NCBI...`);
		const taxonomyData = await this.fetchTaxonomyDataByTaxId(taxId);

		if (taxonomyData && taxonomyData.order) {
			// Step 3: Cache the result in MongoDB
			await this.cacheData(taxId, taxonomyData);
			console.log(`💾 Cached taxId ${taxId}: ${taxonomyData.order}`);
			return taxonomyData.order;
		}

		return null;
	}

	/**
	 * Get taxonomy ID from species name using esearch
	 * 1. Check MongoDB cache first
	 * 2. If not found, use esearch API and cache
	 */
	async getTaxonomyIDs(commonName, scientificName) {
		const searchTerm = scientificName || commonName;
		if (!searchTerm) return null;

		try {
			// Step 1: Check cache first
			const cached = await TaxonomyCache.findOne({
				$or: [
					{ "currentScientificName.name": { $regex: new RegExp(searchTerm, "i") } },
					{ curatorCommonName: { $regex: new RegExp(searchTerm, "i") } },
				],
			});

			if (cached) {
				console.log(`📋 Cache hit for species "${searchTerm}": taxId ${cached.taxId}`);
				return { taxId: cached.taxId, source: "cache" };
			}

			// Step 2: Use esearch API to get taxonomy ID
			console.log(`🔍 Cache miss for species "${searchTerm}", searching NCBI...`);
			const encodedName = encodeURIComponent(searchTerm);
			const esearchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=taxonomy&term=${encodedName}&retmode=json`;

			const response = await axios.get(esearchUrl, { timeout: 10000 });
			const taxId = response.data?.esearchresult?.idlist?.[0];

			if (taxId) {
				console.log(`✅ Found taxId ${taxId} for "${searchTerm}"`);

				// Fetch full taxonomy data and cache it
				const taxonomyData = await this.fetchTaxonomyDataByTaxId(taxId);
				if (taxonomyData) {
					await this.cacheData(taxId, taxonomyData);
				}

				return { taxId, source: "ncbi_search" };
			}

			return null;
		} catch (error) {
			console.error(`❌ Error searching for "${searchTerm}":`, error.message);
			return null;
		}
	}

	/**
	 * Fetch complete taxonomy data using efetch API
	 */
	async fetchTaxonomyDataByTaxId(taxId) {
		try {
			const efetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=taxonomy&id=${taxId}&retmode=xml`;
			const response = await axios.get(efetchUrl, { timeout: 15000 });

			// Parse XML response
			const parsed = await this.parser.parseStringPromise(response.data);
			const taxon = parsed?.TaxaSet?.Taxon;

			if (!taxon) return null;

			// Extract order from lineage
			const order = this.extractOrderFromLineage(taxon.LineageEx?.Taxon);

			// Handle common name (can be string or array)
			let commonName = taxon.CommonName || taxon.OtherNames?.CommonName;
			if (Array.isArray(commonName)) {
				commonName = commonName[0]; // Take first common name if array
			}

			return {
				taxId: taxId.toString(),
				order,
				scientificName: taxon.ScientificName,
				commonName,
				classification: this.buildClassificationArray(taxon.LineageEx?.Taxon),
				source: "ncbi_efetch",
				fullData: taxon,
			};
		} catch (error) {
			console.error(`❌ Error fetching taxonomy data for ${taxId}:`, error.message);
			return null;
		}
	}

	/**
	 * Extract order from NCBI lineage data
	 */
	extractOrderFromLineage(lineage) {
		if (!lineage) return null;

		const lineageArray = Array.isArray(lineage) ? lineage : [lineage];

		// Find the taxon with rank "order"
		const orderTaxon = lineageArray.find((item) => item.Rank === "order");

		return orderTaxon ? orderTaxon.ScientificName : null;
	}

	/**
	 * Build classification array from lineage
	 */
	buildClassificationArray(lineage) {
		if (!lineage) return [];

		const lineageArray = Array.isArray(lineage) ? lineage : [lineage];

		return lineageArray.map((item) => `${item.ScientificName} (${item.Rank}, ID: ${item.TaxId})`);
	}

	/**
	 * Cache taxonomy data in MongoDB
	 */
	async cacheData(taxId, data) {
		try {
			await TaxonomyCache.findOneAndUpdate(
				{ taxId: taxId.toString() },
				{
					taxId: taxId.toString(),
					order: data.order,
					currentScientificName: { name: data.scientificName },
					curatorCommonName: data.commonName,
					classification: data.classification || [],
					source: data.source,
					fullData: data.fullData,
					lastUpdated: new Date(),
				},
				{ upsert: true }
			);
		} catch (error) {
			console.error(`❌ Cache error for ${taxId}:`, error.message);
		}
	}
}

module.exports = new TaxonomyService();
