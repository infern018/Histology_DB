const router = require("express").Router()
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { verifyTokenAndAuth, verifyTokenAndAdmin, verifyToken } = require('./verifyToken');
const userController = require("../controllers/userController");

//UPDATE
router.put("/:id", verifyTokenAndAuth, userController.updateUser);

// GET Collections of a USER
router.get("/:id/collections", userController.getUserCollections);

router.post("/details", userController.fetchUserDetails)

//DELETE
router.delete("/:id", verifyTokenAndAuth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User deleted successfully");
    } catch (err) {
        res.status(500).json(err);
    }
})

//only ADMINS can get a user
//GET
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        const { password, ...others } = user._doc;

        res.status(200).json(others);
    } catch (error) {
        res.status(500).json(error);
    }
})

//GET ALL USER ID AND NAMES
router.get("/meta/all", verifyToken, async (req, res) => {
    try {
        // get all users
        const users = await User.find({});
        const userMetas = users.map((user) => {
            return {
                _id: user._id,
                username: user.username,
            }
        })
        res.status(200).json(userMetas);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;
