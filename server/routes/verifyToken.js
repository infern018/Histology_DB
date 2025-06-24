const jwt = require("jsonwebtoken");
const Collection = require("../models/Collection");
const Entry = require("../models/Entry");

// verifies that the token is valid
const verifyToken = (req, res, next) => {
	const token = req.headers.token;

	if (token) {
		jwt.verify(token, process.env.JWT_SEC, (err, user) => {
			if (err) {
				res.status(403).json("Token is invalid!");
			}
			req.user = user;
			next();
		});
	} else {
		return res.status(401).json("You are not logged in!");
	}
};

//verifies that the user who is logged in only he is making the request
const verifyTokenAndAuth = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.user.id === req.params.id || req.user.isAdmin) {
			next();
		} else {
			res.status(403).json("You are not allowed to do that");
		}
	});
};

//verify to check if the person making the request is the owner or not
const verifyTokenAndAuthCollection = async (req, res, next) => {
	const collection = await Collection.findById(req.params.id);
	if (!collection) {
		return res.status(404).json({ error: "Collection not found" });
	}

	verifyToken(req, res, () => {
		if (req.user.id === collection.ownerID.toString() || req.user.isAdmin) {
			next();
		} else {
			res.status(403).json("You are not allowed to do that");
		}
	});
};

const verifyTokenAndAdmin = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.user.isAdmin) {
			next();
		} else {
			res.status(403).json("You are not authorized to access admin resources");
		}
	});
};

// entry verifications

//CREATE ENTRY
// verify that the user is owner of collection or user is collaborator with edit mode access
const verifyEntryEditAccess = async (req, res, next) => {
	verifyToken(req, res, async () => {
		const collection = await Collection.findById(req.body.collectionID);

		if (!collection) {
			return res.status(404).json({ error: "Collection not found" });
		}

		var hasEditAccess = false;

		if (req.user.id === collection.ownerID.toString()) {
			hasEditAccess = true;
		} else {
			collection.collaborators.forEach((collaborator) => {
				if (collaborator.user_id.toString() === req.user.id && collaborator.mode === "edit") {
					hasEditAccess = true;
				}
			});
		}

		if (hasEditAccess) {
			next();
		} else {
			res.status(403).json("You are not allowed to do that");
		}
	});
};

const verifyEntryReadAccess = async (req, res, next) => {
	verifyToken(req, res, async () => {
		// get the entry
		const entry = await Entry.findById(req.params.id);

		if (!entry) {
			return res.status(404).json({ error: "Entry not found" });
		}

		// get the collection
		const collection = await Collection.findById(entry.collectionID);

		if (!collection) {
			return res.status(404).json({ error: "Collection associated with entry D.N.E" });
		}

		var hasViewAccess = false;

		if (req.user.id === collection.ownerID.toString()) {
			hasViewAccess = true;
		} else {
			collection.collaborators.forEach((collaborator) => {
				if (collaborator.user_id.toString() === req.user.id) {
					hasViewAccess = true;
				}
			});
		}

		if (hasViewAccess) {
			next();
		} else {
			res.status(403).json("You are not allowed to do that");
		}
	});
};

// a function to verify if the entry is part of a collection that has visibility: "public"
const verifyPublicEntry = async (req, res, next) => {
	const entry = await Entry.findById(req.params.id);

	if (!entry) {
		return res.status(404).json({ error: "Entry not found" });
	}

	const collection = await Collection.findById(entry.collectionID);

	if (!collection) {
		return res.status(404).json({ error: "Collection associated with entry D.N.E" });
	}

	if (collection.visibility === "public") {
		next();
	} else {
		res.status(403).json("Not a public collection entry");
	}
};

const verifyPublicCollection = async (req, res, next) => {
	const collection = await Collection.findById(req.params.id);

	if (!collection) {
		return res.status(404).json({ error: "Collection not found" });
	}

	if (collection.visibility === "public") {
		next();
	} else {
		res.status(403).json("Not a public collection");
	}
};

// make a function where a user requesting to view the entries of a collection has to be either the owner or a collaborator with view access
const verifyCollectionReadAccess = async (req, res, next) => {
	verifyToken(req, res, async () => {
		const collection = await Collection.findById(req.params.id);

		if (!collection) {
			return res.status(404).json({ error: "Collection not found" });
		}

		var hasViewAccess = false;

		// Check if user is admin
		if (req.user.isAdmin) {
			hasViewAccess = true;
		} else if (req.user.id === collection.ownerID.toString()) {
			hasViewAccess = true;
		} else {
			collection.collaborators.forEach((collaborator) => {
				if (collaborator.user_id.toString() === req.user.id) {
					hasViewAccess = true;
				}
			});
		}

		if (hasViewAccess) {
			next();
		} else {
			res.status(403).json("You are not allowed to do that");
		}
	});
};

const verifyCollectionEditAccess = async (req, res, next) => {
	verifyToken(req, res, async () => {
		const collection = await Collection.findById(req.params.id);

		if (!collection) {
			return res.status(404).json({ error: "Collection not found" });
		}

		var hasEditAccess = false;

		if (req.user.id === collection.ownerID.toString()) {
			hasEditAccess = true;
		} else {
			collection.collaborators.forEach((collaborator) => {
				if (collaborator.user_id.toString() === req.user.id && collaborator.mode === "edit") {
					hasEditAccess = true;
				}
			});
		}

		if (hasEditAccess) {
			next();
		} else {
			res.status(403).json("You are not allowed to do that");
		}
	});
};

module.exports = {
	verifyToken,
	verifyTokenAndAuth,
	verifyTokenAndAdmin,
	verifyTokenAndAuthCollection,
	verifyEntryEditAccess,
	verifyEntryReadAccess,
	verifyPublicEntry,
	verifyPublicCollection,
	verifyCollectionReadAccess,
};
