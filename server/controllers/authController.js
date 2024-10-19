const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Collection = require("../models/Collection");

const register = async (req, res) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPass = await bcrypt.hash(req.body.password, salt);

		const newUser = new User(req.body);
		newUser.password = hashedPass;

		const user = await newUser.save();

		// TODO : FIX THIS
		// A workaround for now : if a new user signs up, make them the collaborator for all public collections in view mode
		// this is to show the user some collections when they login

		// get all public collections where publicStatus == approved
		const publicCollections = await Collection.find({ publicStatus: "approved" });

		// for each collection in its collaborators array, add the new user as a collaborator in view mode if not already present
		publicCollections.forEach(async (collection) => {
			const existingCollaborator = collection.collaborators.find(
				(collaborator) => collaborator.user_id.toString() === user._id.toString()
			);

			if (!existingCollaborator) {
				collection.collaborators.push({ user_id: user._id, mode: "view" });
				await collection.save();
			}

			user.collaboratingCollections.push({
				collection_id: collection._id,
				mode: "view",
			});
		});

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
};

const login = async (req, res) => {
	try {
		const user = await User.findOne({ username: req.body.username });
		if (!user) {
			res.status(400).json("Wrong credentials!");
			return;
		}

		// if user is logged in with github don't validate the password
		if (user.githubId) {
			const accessToken = jwt.sign(
				{
					id: user._id,
					isAdmin: user.isAdmin,
				},
				process.env.JWT_SEC,
				{ expiresIn: "3d" }
			);

			const { password, ...others } = user._doc;
			res.status(200).json({ ...others, accessToken });
			return;
		}

		const validated = await bcrypt.compare(req.body.password, user.password);
		if (!validated) {
			res.status(401).json("Wrong password!");
			return;
		}

		const accessToken = jwt.sign(
			{
				id: user._id,
				isAdmin: user.isAdmin,
			},
			process.env.JWT_SEC,
			{ expiresIn: "3d" }
		);

		const { password, ...others } = user._doc;
		res.status(200).json({ ...others, accessToken });
	} catch (err) {
		res.status(500).json(err);
	}
};

const logout = async (req, res) => {
	try {
		res.status(200).json("Logout successful");
	} catch (err) {
		res.status(500).json(err);
	}
};

module.exports = {
	register,
	login,
	logout,
};
