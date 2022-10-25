const mongoose = require('mongoose');

const roles = {
    ADMIN:'admin',
    MODERATOR:'moderator',
    PUBLIC:'public'
}

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    role:{
        type:String,
        enum: Object.values(roles).concat([null]),
    }
},{timestamps:true});

module.exports = mongoose.model("User",UserSchema);