const router = require("express").Router()
const {verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin} = require('./verifyToken');
const Workspace = require("../models/Workspace")

//CREATE WORKSPACE

//REMOVING VERIFY_TOKEN+AUTH MIDDLEWARE FOR NOW SINCE I WANT TO CREATE WORKSPACE ON REGISTER (NO ACCESS TOKEN AFTER REGISTER)

router.post("/", async (req,res)=>{
    const newWorkspace = new Workspace(req.body);   

    try {
        const savedWorkspace = await newWorkspace.save();
        res.status(200).json(savedWorkspace)
    } catch (err) {
        res.status(500).json(err)
    }
})

// UPDATE WORKSPACE
router.put("/:id/:workspaceID", verifyTokenAndAuth , async (req,res)=> {
    try{ 
        const updatedWorkspace = await Workspace.findByIdAndUpdate(
            req.params.workspaceID,
            {
                $set:req.body
            },{ new:true }
        );
        res.status(200).json(updatedWorkspace);
    } catch(err){
        res.status(500).json(err);
    }
});

//DELETE
router.delete("/:id", verifyTokenAndAuth , async (req,res)=> {
    try{
        await Workspace.findByIdAndDelete(req.params.id);
        res.status(200).json("Workspace entry deleted successfully");
    } catch (err){
        res.status(500).json(err);
    }
})

//GET USER WORKSPACE
router.get("/find/:id/", verifyTokenAndAuth ,async (req,res)=> {
    try {
        const workspace = await Workspace.findOne({userId:req.params.id});
        res.status(200).json(workspace);
    } catch (error) {
        res.status(500).json(err);
    }
})

//GET ALL WORKSPACES
router.get("/", verifyTokenAndAdmin, async (req,res)=> {
    try {
        const workspaces = await Workspace.find();
        res.status(200).json(workspaces);
    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router;