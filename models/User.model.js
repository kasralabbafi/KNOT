const mongoose = require('mongoose');

const userValidator = require('../validations/userValidator');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 1,
        max: 99,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    seqQuestions: {
        type: [String],
        required: true
    },
    seqAnswers: {
        type: [String]
    }
})

userSchema.statics.validate = (data) => {
    return userValidator.validate(data, {abortEarly: false})
}


module.exports = mongoose.model("User", userSchema)