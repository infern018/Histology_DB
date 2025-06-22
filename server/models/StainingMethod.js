const mongoose = require("mongoose");

const StainingMethodSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		category: {
			type: String,
			required: true,
			enum: [
				"Nissl & Cell Body Stains",
				"Myelin Stains",
				"General Structural/Connective Tissue Stains",
				"Silver Stains",
				"Enzyme Histochemistry",
				"Glial and Fiber Stains",
				"Immunohistochemistry",
				"Specialized/Other",
			],
		},
		aliases: {
			type: [String],
			default: [],
			// Store common variations/misspellings for fuzzy matching
		},
		description: {
			type: String,
			trim: true,
		},
		// For tracking usage and improving suggestions
		usageCount: {
			type: Number,
			default: 0,
		},
		// For future extensibility
		active: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

// Create text index for search functionality
StainingMethodSchema.index({
	name: "text",
	aliases: "text",
	description: "text",
});

// Create index for category-based queries
StainingMethodSchema.index({ category: 1, active: 1 });

// Instance method to increment usage count
StainingMethodSchema.methods.incrementUsage = function () {
	this.usageCount += 1;
	return this.save();
};

module.exports = mongoose.model("StainingMethod", StainingMethodSchema);
