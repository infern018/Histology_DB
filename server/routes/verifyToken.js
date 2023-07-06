const jwt = require('jsonwebtoken');
const Collection = require('../models/Collection');

const verifyToken = (req,res,next) => {
    const authHeader = req.headers.token

    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token,process.env.JWT_SEC,(err,user)=>{
            if(err){
                res.status(403).json("Token is invalid!");
            }
            req.user = user;
            next();
        })
    } else {
        return res.status(401).json("You are not logged in!")
    }
}

//the user who is logged in only he is making the request
const verifyTokenAndAuth = (req,res,next) => {
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        } else {
            res.status(403).json("You are not allowed to do that");
        }
    })
}

//to check if the person making the request is the owner or not
const verifyTokenAndAuthCollection = async (req,res,next) => {
    //assume we are getting collectionID here
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
        return res.status(404).json({ error: "Collection not found" });
    }
    console.log("HERE2", collection.ownerID)
    
    
    verifyToken(req,res,()=>{
        console.log("HERE2", req.user.id)
        if(req.user.id === collection.ownerID.toString() || req.user.isAdmin){
            next();
        } else {
            res.status(403).json("You are not allowed to do that");
        }
    })
}



const verifyTokenAndAdmin = (req,res,next) => {
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next();
        } else {
            res.status(403).json("You are not allowed to do that");
        }
    })
}

module.exports = {verifyToken , verifyTokenAndAuth, verifyTokenAndAdmin, verifyTokenAndAuthCollection};