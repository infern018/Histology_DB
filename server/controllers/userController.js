const Collection = require('../models/Collection');
const User = require('../models/User');

const updateUser = async (req, res) => {
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            }, { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
}

const getUserCollections = async (req, res) => {
    try {


        const user = await User.findById(req.params.id);

        const userOwnedCollections = await Collection.find({ ownerID: user._id });

        const userCollaboratedCollectionIDs = user.collaboratingCollections.map(collab => collab.collection_id);
        const userCollaboratedCollections = await Collection.find({ _id: { $in: userCollaboratedCollectionIDs } });

        const ownedCollections = userOwnedCollections.map(collection => ({
            collection_id: collection._id,
            name: collection.name,
            mode: 'owner'
        }));

        const collaboratedCollections = user.collaboratingCollections.map(collab => {
            const collection = userCollaboratedCollections.find(col => col._id.equals(collab.collection_id));
            return {
                collection_id: collection._id,
                name: collection.name,
                mode: collab.mode
            };
        });


        const userCollections = [...ownedCollections, ...collaboratedCollections];

        // returns : collection_id, collection_name, mode

        res.status(200).json(userCollections);
    } catch (err) {
        res.status(500).json(err);
    }
}

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...other } = user._doc;
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
}

const fetchUserDetails = async (req, res) => {
    const userIDs = req.body.userIDs;
    try {
        const users = await User.find({ _id: { $in: userIDs } });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// function to get all users in the database except the provided user ids (return id and username)
const getAllUsersExcept = async (req, res) => {
    const { userIDs } = req.body;
    try {
        const users = await User.find({ _id: { $nin: userIDs } });
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

    module.exports = {
        updateUser,
        getUserCollections,
        getUser,
        fetchUserDetails,
        getAllUsersExcept
    };
