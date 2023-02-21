const router  = require("express").Router()
const Collection = require("../models/Collection")
const Role = require('../models/Role')
const { verifyToken } = require("./verifyToken")

//CREATE A ROLE

//this route enables the collection owner to create and assign roles

//main admin can create a role for a collection
//"admin role for a collection" should be create by default when a collection is created
router.post("/",async(req,res)=>{
    const newRole = new Role(req.body)

    try {
        const savedRole = await newRole.save();
        res.status(200).json(savedRole);
    } catch (err) {
        res.status(500).json(err);
    }
})

//UPDATE A ROLE

router.put("/:id",verifyToken, async(req,res)=>{
    try {
        const updatedRole = await Role.findByIdAndUpdate(
            req.params.id,
            {
                $set:req.body
            },{new:true}
        );

        res.status(200).json(updatedRole)
    } catch (err) {
        res.status(500).json(err);
    }
})

//DELETE A ROLE
router.delete("/:id",verifyToken, async(req,res)=>{
    try {
        const deletedRole = await Role.findByIdAndDelete(req.params.id)

        res.status(200).json(deletedRole)
    } catch (err) {
        res.status(500).json(err);
    }
})


// GET A SINGLE ROLE
router.get("/:id",verifyToken,async(req,res)=>{
    try {
        const role = await Role.findById(req.params.id)
        res.status(200).json(role);
    } catch (err) {
        res.status(500).json(err);
    }
})


//GET ALL ROLES(COLLABORATORS) FOR A COLLECTION, USED ? project as route
router.get("/",verifyToken,async(req,res)=>{
    try {
        const roles = await Role.find(req.query)
        res.status(200).json(roles);
    } catch (err) {
        res.status(500).json(err);
    }
})



module.exports = router