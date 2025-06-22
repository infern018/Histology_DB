const axios = require("axios");
const xml2js = require("xml2js");

async function getTaxonomicOrder(speciesName) {
	const encodedName = encodeURIComponent(speciesName);

	// Step 1: esearch to get Taxonomy ID
	const esearchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=taxonomy&term=${encodedName}&retmode=json`;
	const esearchResp = await axios.get(esearchUrl);
	const taxId = esearchResp.data.esearchresult.idlist[0];

	console.log("taxId", taxId);

	if (!taxId) throw new Error(`No Taxonomy ID found for ${speciesName}`);

	// Step 2: efetch to get taxonomy XML
	const efetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=taxonomy&id=${taxId}&retmode=xml`;
	const efetchResp = await axios.get(efetchUrl);

	// Step 3: parse XML
	const parser = new xml2js.Parser({ explicitArray: false });
	const parsed = await parser.parseStringPromise(efetchResp.data);

	const lineage = parsed.TaxaSet.Taxon.LineageEx.Taxon;
	const order = Array.isArray(lineage)
		? lineage.find((item) => item.Rank === "order")
		: lineage.Rank === "order"
		? lineage
		: null;

	return order ? order.ScientificName : "Order not found";
}

// Example usage
getTaxonomicOrder("Mouse")
	.then((order) => console.log("Order:", order))
	.catch((err) => console.error("Error:", err.message));
