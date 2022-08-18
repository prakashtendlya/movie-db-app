const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true,
        min: 3,
        max: 255
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 8
    },
    date: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model("User", userSchema);