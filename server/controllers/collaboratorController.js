const User = require("../models/User");
const Collection = require("../models/Collection");
const { ObjectId } = require("mongoose").Types;

// ADD A COLLABORATOR TO A COLLECTION
// -----------------------------------
// Body recieved = { user_id: "user_id", mode: "mode" }
// Add collaborator to collection's collaborators array
// Add collection to user's collaboratingCollections array
const createCollaborator = async (req, res) => {
	const collectionID = req.params.id;
	const newCollaborator = req.body.newCollaborator;

	try {
		const collection = await Collection.findById(collectionID);

		user_id = newCollaborator.user_id;
		mode = newCollaborator.mode;

		const user = await User.findById(user_id);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const existingCollaborator = collection.collaborators.find(
			(collaborator) => collaborator.user_id.toString() === user_id
		);

		if (existingCollaborator) {
			return res.status(200).json({ error: "Collaborator already exists, skipping" });
		}

		collection.collaborators.push({ user_id: user_id, mode: mode });

		// also add the collection to the user's collections
		user.collaboratingCollections.push({
			collection_id: collectionID,
			mode: mode,
		});

		await user.save();

		const updatedCollection = await collection.save();

		res.status(200).json(updatedCollection);
	} catch (err) {
		res.status(500).json(err);
	}
};

// UPDATE A COLLABORATOR IN A COLLECTION
// --------------------------------------
// Body recieved = { user_id: "user_id", mode: "mode" }
// Update collaborator's mode in collection's collaborators array
// Update collection's mode in user's collaboratingCollections array
const updateCollaborator = async (req, res) => {
	const collectionID = req.params.id;
	const newCollaborator = req.body.updateCollaborator;

	try {
		user_id = newCollaborator.user_id;
		new_mode = newCollaborator.mode;

		const collection = await Collection.findById(collectionID);
		const user = await User.findById(user_id);

		// find if the collaborator exists
		const collaborator = collection.collaborators.find((collaborator) => collaborator.user_id.equals(user._id));

		if (!collaborator) {
			return res.status(404).json({ error: "Collaborator not found" });
		}

		collection.collaborators = collection.collaborators.map((collaborator) => {
			if (collaborator.user_id.toString() === user_id) {
				collaborator.mode = new_mode;
			}
			return collaborator;
		});

		// update the mode in the user's collection object
		user.collaboratingCollections = user.collaboratingCollections.map((collection) => {
			if (collection.collection_id.toString() === collectionID) {
				collection.mode = new_mode;
			}
			return collection;
		});

		await user.save();

		const updatedCollection = await collection.save();
		res.status(200).json(updatedCollection);
	} catch (err) {
		res.status(500).json(err);
	}
};

// DELETE A COLLABORATOR FROM A COLLECTION
// ----------------------------------------
// Body recieved = { user_id: "user_id" }
// Remove collaborator from collection's collaborators array
// Remove collection from user's collaboratingCollections array
const deleteCollaborator = async (req, res) => {
	const collectionID = req.params.id;
	const collaboratorID = req.body.collaboratorID;

	try {
		const collection = await Collection.findById(collectionID);

		const collaborator = collection.collaborators.find(
			(collaborator) => collaborator.user_id.toString() === collaboratorID
		);

		if (!collaborator) {
			return res.status(404).json({ error: "Collaborator not found" });
		}

		collection.collaborators = collection.collaborators.filter(
			(collaborator) => collaborator.user_id.toString() !== collaboratorID
		);

		// also remove the collection from the user's collections
		const user = await User.findById(collaboratorID);
		user.collaboratingCollections = user.collaboratingCollections.filter(
			(collection) => collection.collection_id.toString() !== collectionID
		);
		await user.save();

		const updatedCollection = await collection.save();
		res.status(200).json(updatedCollection);
	} catch (err) {
		res.status(500).json(err);
	}
};

const flushCollaborators = async (req, res) => {
	const collectionID = req.params.id;

	try {
		const collection = await Collection.findById(collectionID);

		collection.collaborators = [];

		const updatedCollection = await collection.save();
		res.status(200).json(updatedCollection);
	} catch (err) {
		res.status(500).json(err);
	}
};

module.exports = {
	createCollaborator,
	updateCollaborator,
	deleteCollaborator,
	flushCollaborators,
};
