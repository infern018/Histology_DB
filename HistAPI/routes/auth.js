const router = require("express").Router()
const User = require('../models/User');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');

//REGISTER
router.post("/register", async(req,res) => {
    console.log("REGISTRING",req.body);
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password,salt);

        const newUser = new User(req.body);
        newUser.password = hashedPass;

        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err){
        res.status(500).json(err);
    }
})

//LOGIN
router.post("/login", async(req,res) => {
    try{
        const user = await User.findOne({username : req.body.username})
        if(!user){
            res.status(400).json("Wrong credentials!");
            return;
        }

        const validated = await bcrypt.compare(req.body.password, user.password)

        if(!validated){
            res.status(401).json("Wrong password!");
            return;
        }
        //create JWT for user
        const accessToken = jwt.sign(
            {
                id:user._id,
                isAdmin:user.isAdmin,
            },
            process.env.JWT_SEC,
            {expiresIn:"3d"}
        );

        const {password, ...others} = user._doc
            console.log({...others,accessToken})
        res.status(200).json({...others,accessToken});

    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;