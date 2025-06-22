const mongoose = require("mongoose");

const TaxonomyCacheSchema = mongoose.Schema(
	{
		taxId: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		currentScientificName: {
			name: String,
			authority: String,
		},
		curatorCommonName: String,
		order: String,
		classification: {
			type: [String],
			default: [],
		},
		lastUpdated: {
			type: Date,
			default: Date.now,
		},
		source: {
			type: String,
			enum: ["ncbi_api", "json_import", "ensembl_api"],
			default: "ncbi_api",
		},
		// Store the full taxonomy data for future reference
		fullData: {
			type: mongoose.Schema.Types.Mixed,
			default: null,
		},
	},
	{ timestamps: true }
);

// Create indexes for fast lookups
TaxonomyCacheSchema.index({ taxId: 1 });
TaxonomyCacheSchema.index({ "currentScientificName.name": 1 });
TaxonomyCacheSchema.index({ order: 1 });
TaxonomyCacheSchema.index({ lastUpdated: 1 });

module.exports = mongoose.model("TaxonomyCache", TaxonomyCacheSchema);
