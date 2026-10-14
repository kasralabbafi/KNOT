const mongoose = require('mongoose');

const tokenSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    tokenHash: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    expiresAt: {
        type: Date,
        default: new Date(Date.now + (1000 * 60 * 60 * 24 * 7))
    },
    revokedAt: {
        type: Date,
        default: null
    },
    familyId: {
        type: String,
        required: true
    },
    replacedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RefreshToken"
    },
    device: {
        type: String,
        default: null
    },
    createdByIp: {
        type: String,
        default: null
    }
})

module.exports = mongoose.model("Token", tokenSchema)