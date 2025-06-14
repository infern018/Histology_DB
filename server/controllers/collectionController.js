const Collection = require("../models/Collection");
const Entry = require("../models/Entry");
const redisClient = require("../utils/redisClient");

const generateCollectionCode = (collectionName) => {
	collectionName = collectionName.replace(/\s/g, "");
	const collectionCode = "Collection_" + collectionName;
	return collectionCode;
};

const createCollection = async (req, res) => {
	const newCollection = new Collection(req.body);

	newCollection.ownerID = req.user.id;

	try {
		const savedCollection = await newCollection.save();
		res.status(200).json(savedCollection);
	} catch (err) {
		res.status(500).json(err);
	}
};

const updateCollection = async (req, res) => {
	const newCollection = req.body;

	console.log("newCollection", newCollection);
	console.log("req.body", req.body);

	if (req.body.name) {
		newCollection.collectionCode = generateCollectionCode(req.body.name);
	}

	try {
		const updatedCollection = await Collection.findByIdAndUpdate(
			req.params.id,
			{
				$set: newCollection,
			},
			{ new: true }
		);

		res.status(200).json(updatedCollection);
	} catch (err) {
		res.status(500).json(err);
	}
};

// mark backupCollection as true
const deleteCollection = async (req, res) => {
	try {
		const updatedCollection = await Collection.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					backupCollection: true,
				},
			},
			{ new: true }
		);

		res.status(200).json(updatedCollection);
	} catch (err) {
		res.status(500).json(err);
	}
};

// API that will delete all entries with collectionID = req.params.id
const flushCollection = async (req, res) => {
	try {
		const result = await Entry.deleteMany({ collectionID: req.params.id });
		res.status(200).json({
			message: "Collection flushed successfully",
			deletedCount: result.deletedCount,
		});
	} catch (err) {
		res.status(500).json(err);
	}
};

const getCollection = async (req, res) => {
	try {
		const collection = await Collection.findById(req.params.id);
		res.status(200).json(collection);
	} catch (err) {
		res.status(500).json(err);
	}
};

const getCollectionNameAndNumCollaborators = async (req, res) => {
	try {
		const collection = await Collection.findById(req.params.id);
		const { name, collaborators } = collection;
		res.status(200).json({ name, numCollaborators: collaborators.length });
	} catch (err) {
		res.status(500).json(err);
	}
};

// get public collections with Redis caching

const getPublicCollections = async (req, res) => {
	try {
		const cacheKey = "publicCollections";
		const cachedData = await redisClient.get(cacheKey);

		if (cachedData) {
			return res.status(200).json(JSON.parse(cachedData));
		}

		const collections = await Collection.find({ publicStatus: "approved" });

		const collections_data = collections.map((collection) => ({
			collection_id: collection._id,
			name: collection.name,
			mode: "view",
		}));

		// Cache the data for 1 hour
		await redisClient.set(cacheKey, JSON.stringify(collections_data), {
			EX: 3600,
		});

		res.status(200).json(collections_data);
	} catch (err) {
		res.status(500).json(err);
	}
};

module.exports = {
	createCollection,
	updateCollection,
	deleteCollection,
	getCollection,
	getCollectionNameAndNumCollaborators,
	getPublicCollections,
	flushCollection,
};
