const router = require("express").Router()
const User = require('../models/User');
const bcrypt = require('bcrypt');
const {verifyTokenAndAuth, verifyTokenAndAdmin} = require('./verifyToken');

//UPDATE
router.put("/:id", verifyTokenAndAuth , async (req,res)=> {
    if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password,salt);
    }

    try{
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set:req.body
            },{ new:true }
        );
        res.status(200).json(updatedUser);
    } catch(err){
        res.status(500).json(err);
    }
});

//DELETE
router.delete("/:id", verifyTokenAndAuth, async (req,res)=> {
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User deleted successfully");
    } catch (err){
        res.status(500).json(err);
    }
})

//only ADMINS can get a user
//GET
router.get("/find/:id", verifyTokenAndAdmin, async (req,res)=> {
    try {
        const user = await User.findById(req.params.id);

        const {password, ...others} = user._doc;

        res.status(200).json(others);
    } catch (error) {
        res.status(500).json(err);
    }
})

//GET ALL USERS TODO: (REMOVING AUTH_AND_ADMIN for getting all users while editors/viewers criteria)
router.get("/", async (req,res)=> {
    const query = req.query.new;

    try {
        const users = query
        ? await User.find().sort({_id : -1}).limit(5) //shows 5 most recent users
        : await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(err);
    }
})

module.exports = router;