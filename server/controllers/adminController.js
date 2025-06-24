const Collection = require("../models/Collection");
const Entry = require("../models/Entry");
const User = require("../models/User");
const brainParts = require("../utils/brainParts.json");
const stainingGroups = require("../utils/stainingGroups.json");

// Get all standardized values for validation
const getStandardizedValues = () => {
	const standardizedBrainParts = new Set();
	const standardizedStainingMethods = new Set();

	// Flatten brain parts
	Object.values(brainParts).forEach((parts) => {
		parts.forEach((part) => standardizedBrainParts.add(part.toLowerCase()));
	});

	// Flatten staining methods
	Object.values(stainingGroups).forEach((methods) => {
		methods.forEach((method) => standardizedStainingMethods.add(method.toLowerCase()));
	});

	return { standardizedBrainParts, standardizedStainingMethods };
};

// Generate validation report for a collection
const generateValidationReport = async (collectionId) => {
	try {
		const entries = await Entry.find({ collectionID: collectionId });
		const { standardizedBrainParts, standardizedStainingMethods } = getStandardizedValues();

		const report = {
			totalEntries: entries.length,
			validationResults: {
				brainParts: {
					standardized: [],
					nonStandardized: [],
				},
				stainingMethods: {
					standardized: [],
					nonStandardized: [],
				},
			},
			issues: [],
		};

		entries.forEach((entry) => {
			// Validate brain parts
			if (entry.histologicalInformation?.brainPart) {
				const brainPart = entry.histologicalInformation.brainPart.toLowerCase();
				if (standardizedBrainParts.has(brainPart)) {
					if (
						!report.validationResults.brainParts.standardized.includes(
							entry.histologicalInformation.brainPart
						)
					) {
						report.validationResults.brainParts.standardized.push(entry.histologicalInformation.brainPart);
					}
				} else {
					if (
						!report.validationResults.brainParts.nonStandardized.includes(
							entry.histologicalInformation.brainPart
						)
					) {
						report.validationResults.brainParts.nonStandardized.push(
							entry.histologicalInformation.brainPart
						);
					}
				}
			}

			// Validate staining methods
			if (entry.histologicalInformation?.stainingMethod) {
				const stainingMethod = entry.histologicalInformation.stainingMethod.toLowerCase();
				if (standardizedStainingMethods.has(stainingMethod)) {
					if (
						!report.validationResults.stainingMethods.standardized.includes(
							entry.histologicalInformation.stainingMethod
						)
					) {
						report.validationResults.stainingMethods.standardized.push(
							entry.histologicalInformation.stainingMethod
						);
					}
				} else {
					if (
						!report.validationResults.stainingMethods.nonStandardized.includes(
							entry.histologicalInformation.stainingMethod
						)
					) {
						report.validationResults.stainingMethods.nonStandardized.push(
							entry.histologicalInformation.stainingMethod
						);
					}
				}
			}

			// Check for missing required fields
			if (!entry.identification?.bionomialSpeciesName) {
				report.issues.push(`Entry ${entry.identification?.itemCode || entry._id}: Missing species name`);
			}
			if (!entry.histologicalInformation?.stainingMethod) {
				report.issues.push(`Entry ${entry.identification?.itemCode || entry._id}: Missing staining method`);
			}
			if (!entry.histologicalInformation?.brainPart) {
				report.issues.push(`Entry ${entry.identification?.itemCode || entry._id}: Missing brain part`);
			}
		});

		return report;
	} catch (error) {
		throw new Error(`Failed to generate validation report: ${error.message}`);
	}
};

// Get all collections pending review
const getCollectionsInReview = async (req, res) => {
	try {
		const collections = await Collection.find({
			publicationRequestStatus: { $in: ["in_review", "changes_requested"] },
		})
			.populate("ownerID", "username email")
			.populate("adminComments.adminId", "username email")
			.sort({ publicationRequestedAt: -1 });

		// Generate validation reports for each collection
		const collectionsWithReports = await Promise.all(
			collections.map(async (collection) => {
				const validationReport = await generateValidationReport(collection._id);
				return {
					...collection.toObject(),
					validationReport,
				};
			})
		);

		res.status(200).json(collectionsWithReports);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Request publication for a collection
const requestPublication = async (req, res) => {
	try {
		const { id } = req.params;
		const collection = await Collection.findById(id);

		if (!collection) {
			return res.status(404).json({ error: "Collection not found" });
		}

		// Check if user owns the collection
		if (collection.ownerID.toString() !== req.user.id) {
			return res.status(403).json({ error: "Unauthorized" });
		}

		// Check if collection is private
		if (collection.visibility !== "private") {
			return res.status(400).json({ error: "Only private collections can request publication" });
		}

		// Allow resubmission if changes were requested, otherwise check if already has a pending request
		if (collection.publicationRequestStatus && collection.publicationRequestStatus !== "changes_requested") {
			return res.status(400).json({ error: "Publication request already exists" });
		}

		// Generate validation report
		const validationReport = await generateValidationReport(id);

		const updatedCollection = await Collection.findByIdAndUpdate(
			id,
			{
				publicationRequestStatus: "in_review",
				publicationRequestedAt: new Date(),
				validationReport,
			},
			{ new: true }
		);

		res.status(200).json(updatedCollection);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Approve publication request
const approvePublication = async (req, res) => {
	try {
		const { id } = req.params;
		const { comment } = req.body;

		const collection = await Collection.findById(id);
		if (!collection) {
			return res.status(404).json({ error: "Collection not found" });
		}

		const adminComment = {
			adminId: req.user.id,
			comment: comment || "Collection approved for publication",
			createdAt: new Date(),
		};

		const updatedCollection = await Collection.findByIdAndUpdate(
			id,
			{
				publicationRequestStatus: "published",
				visibility: "public",
				$push: { adminComments: adminComment },
			},
			{ new: true }
		);

		res.status(200).json(updatedCollection);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Request changes for publication
const requestChanges = async (req, res) => {
	try {
		const { id } = req.params;
		const { comment } = req.body;

		if (!comment) {
			return res.status(400).json({ error: "Comment is required when requesting changes" });
		}

		const collection = await Collection.findById(id);
		if (!collection) {
			return res.status(404).json({ error: "Collection not found" });
		}

		const adminComment = {
			adminId: req.user.id,
			comment,
			createdAt: new Date(),
		};

		const updatedCollection = await Collection.findByIdAndUpdate(
			id,
			{
				publicationRequestStatus: "changes_requested",
				$push: { adminComments: adminComment },
			},
			{ new: true }
		);

		res.status(200).json(updatedCollection);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Get validation report for a specific collection
const getValidationReport = async (req, res) => {
	try {
		const { id } = req.params;
		const validationReport = await generateValidationReport(id);
		res.status(200).json(validationReport);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Add admin comment
const addAdminComment = async (req, res) => {
	try {
		const { id } = req.params;
		const { comment } = req.body;

		if (!comment) {
			return res.status(400).json({ error: "Comment is required" });
		}

		const adminComment = {
			adminId: req.user.id,
			comment,
			createdAt: new Date(),
		};

		const updatedCollection = await Collection.findByIdAndUpdate(
			id,
			{
				$push: { adminComments: adminComment },
			},
			{ new: true }
		).populate("adminComments.adminId", "username email");

		res.status(200).json(updatedCollection.adminComments);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = {
	getCollectionsInReview,
	requestPublication,
	approvePublication,
	requestChanges,
	getValidationReport,
	addAdminComment,
};
