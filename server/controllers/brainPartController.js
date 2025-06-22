const BrainPart = require("../models/BrainPart");

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

// Get all standardized brain parts grouped by category
const getStandardizedBrainParts = async (req, res) => {
	try {
		const brainParts = await BrainPart.find({ active: true }).sort({ category: 1, name: 1 });

		// Group by category
		const groupedBrainParts = brainParts.reduce((acc, part) => {
			const category = part.category || "Other";
			if (!acc[category]) {
				acc[category] = [];
			}
			acc[category].push(part.name);
			return acc;
		}, {});

		res.status(200).json(groupedBrainParts);
	} catch (error) {
		console.error("Error fetching standardized brain parts:", error);
		res.status(500).json({ error: "Failed to fetch standardized brain parts" });
	}
};

// Get suggestions for a single brain part input
const getSuggestions = async (req, res) => {
	try {
		const { input, threshold = 0.6 } = req.body;

		if (!input || typeof input !== "string" || input.trim().length === 0) {
			return res.status(400).json({ error: "Input is required and must be a non-empty string" });
		}

		const inputLower = input.toLowerCase().trim();

		// First check for exact matches (case-insensitive)
		const exactMatch = await BrainPart.findOne({
			$or: [{ name: new RegExp(`^${inputLower}$`, "i") }, { aliases: new RegExp(`^${inputLower}$`, "i") }],
			active: true,
		});

		if (exactMatch) {
			return res.status(200).json({
				exact_match: exactMatch.name,
				suggestions: [],
			});
		}

		// Get all brain parts for fuzzy matching
		const allBrainParts = await BrainPart.find({ active: true });
		const suggestions = [];

		// Check similarity against names and aliases
		for (const part of allBrainParts) {
			let bestScore = 0;

			// Check against main name
			const nameScore = calculateSimilarity(inputLower, part.name.toLowerCase());
			bestScore = Math.max(bestScore, nameScore);

			// Check against aliases
			for (const alias of part.aliases) {
				const aliasScore = calculateSimilarity(inputLower, alias.toLowerCase());
				bestScore = Math.max(bestScore, aliasScore);
			}

			if (bestScore >= threshold) {
				suggestions.push({
					standardized_name: part.name,
					category: part.category,
					confidence: Math.round(bestScore * 1000) / 1000, // Round to 3 decimal places
					matched_alias:
						bestScore > nameScore
							? part.aliases.find(
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
	} catch (error) {
		console.error("Error getting brain part suggestions:", error);
		res.status(500).json({ error: "Failed to get brain part suggestions" });
	}
};

// Get suggestions for multiple brain parts (bulk)
const getBatchSuggestions = async (req, res) => {
	try {
		const { brain_parts, threshold = 0.6 } = req.body;

		if (!Array.isArray(brain_parts)) {
			return res.status(400).json({ error: "brain_parts must be an array" });
		}

		const results = {};

		// Get all brain parts once for efficiency
		const allBrainParts = await BrainPart.find({ active: true });

		for (const input of brain_parts) {
			if (!input || typeof input !== "string") continue;

			const inputLower = input.toLowerCase().trim();

			// Check for exact match
			const exactMatch = allBrainParts.find(
				(part) =>
					part.name.toLowerCase() === inputLower ||
					part.aliases.some((alias) => alias.toLowerCase() === inputLower)
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

			for (const part of allBrainParts) {
				let bestScore = 0;

				// Check against main name
				const nameScore = calculateSimilarity(inputLower, part.name.toLowerCase());
				bestScore = Math.max(bestScore, nameScore);

				// Check against aliases
				for (const alias of part.aliases) {
					const aliasScore = calculateSimilarity(inputLower, alias.toLowerCase());
					bestScore = Math.max(bestScore, aliasScore);
				}

				if (bestScore >= threshold) {
					suggestions.push({
						standardized_name: part.name,
						category: part.category,
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
	} catch (error) {
		console.error("Error getting batch brain part suggestions:", error);
		res.status(500).json({ error: "Failed to get batch brain part suggestions" });
	}
};

// Update usage count when a brain part is used
const incrementUsage = async (req, res) => {
	try {
		const { name } = req.body;

		if (!name) {
			return res.status(400).json({ error: "Brain part name is required" });
		}

		const brainPart = await BrainPart.findOne({ name });
		if (!brainPart) {
			return res.status(404).json({ error: "Brain part not found" });
		}

		await brainPart.incrementUsage();
		res.status(200).json({ message: "Usage count updated", usageCount: brainPart.usageCount });
	} catch (error) {
		console.error("Error incrementing brain part usage:", error);
		res.status(500).json({ error: "Failed to increment usage count" });
	}
};

// Add a new standardized brain part (admin function)
const addBrainPart = async (req, res) => {
	try {
		const { name, category, aliases, description } = req.body;

		if (!name) {
			return res.status(400).json({ error: "Brain part name is required" });
		}

		const newBrainPart = new BrainPart({
			name: name.trim(),
			category,
			aliases: aliases || [],
			description,
		});

		await newBrainPart.save();
		res.status(201).json({ message: "Brain part added successfully", brainPart: newBrainPart });
	} catch (error) {
		if (error.code === 11000) {
			return res.status(400).json({ error: "Brain part with this name already exists" });
		}
		console.error("Error adding brain part:", error);
		res.status(500).json({ error: "Failed to add brain part" });
	}
};

module.exports = {
	getStandardizedBrainParts,
	getSuggestions,
	getBatchSuggestions,
	incrementUsage,
	addBrainPart,
};
