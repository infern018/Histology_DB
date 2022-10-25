const mongoose = require('mongoose');

const WorkspaceSchema = new mongoose.Schema({
    userId : {
        type:String,
        required:true
    },
    entries : [
        {
            entryId:{
                type:String
            }
        }
    ]
},{timestamps:true});

module.exports = mongoose.model("Workspace",WorkspaceSchema);