const Collection = require("../models/Collection");

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

// get public collections
const getPublicCollections = async (req, res) => {
	try {
		const collections = await Collection.find({ publicStatus: "approved" });

		const collections_data = collections.map((collection) => ({
			collection_id: collection._id,
			name: collection.name,
			mode: "view",
		}));

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
};
