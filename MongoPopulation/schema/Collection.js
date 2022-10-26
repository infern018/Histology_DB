const mongoose = require('mongoose');

const visibilities = {
    PUBLIC:'public',
    PRIVATE:'private'
}

const status = {
    PENDING:'pending',
    PUBLIC:'approved',
    DECLINED:'declined',
    UNSENT:'unsent'
}

const CollectionSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },

    description:{
        type:String
    },

    //ID of the owner of collection
    ownerID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Owner_of_this_collection',
        required:true
    },

    visibility:{
        type:String,
        enum: Object.values(visibilities).concat([null]),
        default:'private'
    },

    provenanceDB_ID:{
        type:String
    },

    //for deleting purposes
    backupCollection:{
        type:Boolean,
        default:false
    },

    publicStatus:{
        type:String,
        enum:Object.values(status).concat([null]),
        default:'unsent',
    }
},{timestamps:true})

module.exports = mongoose.model("Collections",CollectionSchema);