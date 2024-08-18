const mongoose = require('mongoose');

const roles = {
    ADMIN: 'admin',
    MODERATOR: 'moderator',
    PUBLIC: 'public'
}

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    githubId: {
        type: String,
        required: false, // Optional for users not logging in via GitHub
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: Object.values(roles).concat([null]),
    },
    collaboratingCollections: [
        {
            collection_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Collection",
            },
            mode: {
                type: String,
                enum: ["view", "edit"],
                default: "view",
            },
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
