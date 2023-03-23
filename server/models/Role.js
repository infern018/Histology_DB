const mongoose = require('mongoose');

// for now permissions are set from scratch
// we manually know what a admin/user/editor can do and check such on the API routing side

const roles = {
    ADMIN:'admin',
    USER:'user',
    EDITOR:'editor'
}

const RoleSchema = new mongoose.Schema({
    project:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum: Object.values(roles).concat([null]),
        required:true
    },
    user:{
        type:String,
        required:true
    }
},{timestamps:true});

module.exports = mongoose.model("Role",RoleSchema);