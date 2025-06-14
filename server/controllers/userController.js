const Collection = require("../models/Collection");
const User = require("../models/User");
const mongoose = require("mongoose");

const updateUser = async (req, res) => {
	if (req.body.password) {
		const salt = await bcrypt.genSalt(10);
		req.body.password = await bcrypt.hash(req.body.password, salt);
	}

	try {
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		res.status(200).json(updatedUser);
	} catch (err) {
		res.status(500).json(err);
	}
};

const getUserCollections = async (req, res) => {
	console.time("getUserCollections");
	try {
		const userId = req.params.id;

		console.time("parallelQueries");

		// Run all queries in parallel with only required fields
		const [user, ownedCollections, collaboratedCollectionIds] = await Promise.all([
			// Check if user exists (minimal query)
			User.findById(userId).select("_id").lean(),

			// Get owned collections with only required fields
			Collection.find({
				ownerID: userId,
				backupCollection: { $ne: true },
			})
				.select("_id name")
				.lean(),

			// Get collaborated collection IDs and modes
			User.findById(userId).select("collaboratingCollections").lean(),
		]);

		console.timeEnd("parallelQueries");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		console.time("collaboratedCollectionsQuery");

		// Get collaborated collections in a separate optimized query
		let collaboratedCollections = [];
		if (collaboratedCollectionIds?.collaboratingCollections?.length > 0) {
			const collabIds = collaboratedCollectionIds.collaboratingCollections.map((c) => c.collection_id);
			const collabCollections = await Collection.find({
				_id: { $in: collabIds },
				backupCollection: { $ne: true },
			})
				.select("_id name")
				.lean();

			// Create a map for faster lookup
			const collabMap = new Map(collabCollections.map((c) => [c._id.toString(), c]));

			collaboratedCollections = collaboratedCollectionIds.collaboratingCollections
				.map((collab) => {
					const collection = collabMap.get(collab.collection_id.toString());
					return collection
						? {
								collection_id: collection._id,
								name: collection.name,
								mode: collab.mode,
						  }
						: null;
				})
				.filter(Boolean); // Remove null entries
		}

		console.timeEnd("collaboratedCollectionsQuery");

		console.time("mapResults");

		// Map owned collections
		const ownedResults = ownedCollections.map((collection) => ({
			collection_id: collection._id,
			name: collection.name,
			mode: "owner",
		}));

		const userCollections = [...ownedResults, ...collaboratedCollections];

		console.timeEnd("mapResults");
		console.timeEnd("getUserCollections");

		res.status(200).json(userCollections);
	} catch (err) {
		console.error(err); // Log the error for server-side debugging
		res.status(500).json({ message: "Internal Server Error", error: err.message });
	}
};

const getUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const { password, ...other } = user._doc;
		res.status(200).json(other);
	} catch (err) {
		res.status(500).json(err);
	}
};

const fetchUserDetails = async (req, res) => {
	const userIDs = req.body.userIDs;
	try {
		const users = await User.find({ _id: { $in: userIDs } });
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// function to get all users in the database except the provided user ids (return id and username)
const getAllUsersExcept = async (req, res) => {
	const { userIDs } = req.body;
	try {
		const users = await User.find({ _id: { $nin: userIDs } });
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = {
	updateUser,
	getUserCollections,
	getUser,
	fetchUserDetails,
	getAllUsersExcept,
};
