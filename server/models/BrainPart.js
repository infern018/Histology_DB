const mongoose = require("mongoose");

const BrainPartSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		category: {
			type: String,
			required: false,
			enum: ["Hemispheres", "Specific Regions", "Lobes", "Structural", "Other"],
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
BrainPartSchema.index({
	name: "text",
	aliases: "text",
	description: "text",
});

// Create index for category-based queries
BrainPartSchema.index({ category: 1, active: 1 });

// Instance method to increment usage count
BrainPartSchema.methods.incrementUsage = function () {
	this.usageCount += 1;
	return this.save();
};

module.exports = mongoose.model("BrainPart", BrainPartSchema);
