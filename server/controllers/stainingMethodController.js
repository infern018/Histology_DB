const StainingMethod = require("../models/StainingMethod");

// Fuzzy matching utility - simple implementation
const calculateSimilarity = (str1, str2) => {
	const longer = str1.length > str2.length ? str1 : str2;
	const shorter = str1.length > str2.length ? str2 : str1;

	if (longer.length === 0) {
		return 1.0;
	}

	const editDistance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
	return (longer.length - editDistance) / longer.length;
};

// Levenshtein distance calculation
const levenshteinDistance = (str1, str2) => {
	const matrix = [];

	for (let i = 0; i <= str2.length; i++) {
		matrix[i] = [i];
	}

	for (let j = 0; j <= str1.length; j++) {
		matrix[0][j] = j;
	}

	for (let i = 1; i <= str2.length; i++) {
		for (let j = 1; j <= str1.length; j++) {
			if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
				matrix[i][j] = matrix[i - 1][j - 1];
			} else {
				matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
			}
		}
	}

	return matrix[str2.length][str1.length];
};

// Get all standardized staining methods grouped by category
const getStandardizedStainings = async (req, res) => {
	try {
		const stainings = await StainingMethod.find({ active: true }).sort({ category: 1, usageCount: -1, name: 1 });

		// Group by category
		const groupedStainings = stainings.reduce((acc, staining) => {
			if (!acc[staining.category]) {
				acc[staining.category] = [];
			}
			acc[staining.category].push(staining.name);
			return acc;
		}, {});

		res.status(200).json(groupedStainings);
	} catch (err) {
		console.error("Error fetching standardized stainings:", err);
		res.status(500).json({ error: "Failed to fetch standardized staining methods" });
	}
};

// Get suggestions for a single staining method input
const getSuggestions = async (req, res) => {
	try {
		const { input, threshold = 0.6 } = req.body;

		if (!input || typeof input !== "string" || input.trim().length === 0) {
			return res.status(400).json({ error: "Input is required and must be a non-empty string" });
		}

		const inputLower = input.toLowerCase().trim();

		// First check for exact matches (case-insensitive)
		const exactMatch = await StainingMethod.findOne({
			$or: [{ name: new RegExp(`^${inputLower}$`, "i") }, { aliases: new RegExp(`^${inputLower}$`, "i") }],
			active: true,
		});

		if (exactMatch) {
			return res.status(200).json({
				exact_match: exactMatch.name,
				suggestions: [],
			});
		}

		// Get all staining methods for fuzzy matching
		const allStainings = await StainingMethod.find({ active: true });
		const suggestions = [];

		// Check similarity against names and aliases
		for (const staining of allStainings) {
			let bestScore = 0;

			// Check against main name
			const nameScore = calculateSimilarity(inputLower, staining.name.toLowerCase());
			bestScore = Math.max(bestScore, nameScore);

			// Check against aliases
			for (const alias of staining.aliases) {
				const aliasScore = calculateSimilarity(inputLower, alias.toLowerCase());
				bestScore = Math.max(bestScore, aliasScore);
			}

			if (bestScore >= threshold) {
				suggestions.push({
					standardized_name: staining.name,
					category: staining.category,
					confidence: Math.round(bestScore * 1000) / 1000, // Round to 3 decimal places
					matched_alias:
						bestScore > nameScore
							? staining.aliases.find(
									(alias) => calculateSimilarity(inputLower, alias.toLowerCase()) === bestScore
							  )
							: null,
				});
			}
		}

		// Sort by confidence descending
		suggestions.sort((a, b) => b.confidence - a.confidence);

		res.status(200).json({
			exact_match: null,
			suggestions: suggestions.slice(0, 5), // Return top 5 suggestions
		});
	} catch (err) {
		console.error("Error getting suggestions:", err);
		res.status(500).json({ error: "Failed to get suggestions" });
	}
};

// Get suggestions for multiple staining methods (bulk)
const getBatchSuggestions = async (req, res) => {
	try {
		const { staining_methods, threshold = 0.6 } = req.body;

		if (!Array.isArray(staining_methods)) {
			return res.status(400).json({ error: "staining_methods must be an array" });
		}

		const results = {};

		// Get all staining methods once for efficiency
		const allStainings = await StainingMethod.find({ active: true });

		for (const input of staining_methods) {
			if (!input || typeof input !== "string") continue;

			const inputLower = input.toLowerCase().trim();

			// Check for exact match
			const exactMatch = allStainings.find(
				(staining) =>
					staining.name.toLowerCase() === inputLower ||
					staining.aliases.some((alias) => alias.toLowerCase() === inputLower)
			);

			if (exactMatch) {
				results[input] = {
					exact_match: exactMatch.name,
					suggestions: [],
				};
				continue;
			}

			// Fuzzy matching
			const suggestions = [];

			for (const staining of allStainings) {
				let bestScore = 0;

				// Check against main name
				const nameScore = calculateSimilarity(inputLower, staining.name.toLowerCase());
				bestScore = Math.max(bestScore, nameScore);

				// Check against aliases
				for (const alias of staining.aliases) {
					const aliasScore = calculateSimilarity(inputLower, alias.toLowerCase());
					bestScore = Math.max(bestScore, aliasScore);
				}

				if (bestScore >= threshold) {
					suggestions.push({
						standardized_name: staining.name,
						category: staining.category,
						confidence: Math.round(bestScore * 1000) / 1000,
					});
				}
			}

			// Sort by confidence descending
			suggestions.sort((a, b) => b.confidence - a.confidence);

			results[input] = {
				exact_match: null,
				suggestions: suggestions.slice(0, 3), // Return top 3 for bulk
			};
		}

		res.status(200).json(results);
	} catch (err) {
		console.error("Error getting batch suggestions:", err);
		res.status(500).json({ error: "Failed to get batch suggestions" });
	}
};

// Admin function to add new standardized staining method
const addStainingMethod = async (req, res) => {
	try {
		const { name, category, aliases = [], description = "" } = req.body;

		if (!name || !category) {
			return res.status(400).json({ error: "Name and category are required" });
		}

		const newStaining = new StainingMethod({
			name: name.trim(),
			category,
			aliases: aliases.map((alias) => alias.trim().toLowerCase()),
			description: description.trim(),
		});

		const savedStaining = await newStaining.save();
		res.status(201).json(savedStaining);
	} catch (err) {
		if (err.code === 11000) {
			// Duplicate key error
			res.status(400).json({ error: "Staining method already exists" });
		} else {
			console.error("Error adding staining method:", err);
			res.status(500).json({ error: "Failed to add staining method" });
		}
	}
};

// Update usage count when a staining method is used
const incrementUsage = async (req, res) => {
	try {
		const { name } = req.body;

		const staining = await StainingMethod.findOne({
			name: new RegExp(`^${name}$`, "i"),
			active: true,
		});

		if (staining) {
			await staining.incrementUsage();
			res.status(200).json({ message: "Usage count updated" });
		} else {
			res.status(404).json({ error: "Staining method not found" });
		}
	} catch (err) {
		console.error("Error updating usage count:", err);
		res.status(500).json({ error: "Failed to update usage count" });
	}
};

module.exports = {
	getStandardizedStainings,
	getSuggestions,
	getBatchSuggestions,
	addStainingMethod,
	incrementUsage,
};
