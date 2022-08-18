const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        index: true
    },
    Title: {
        type: String,
        required: true
    },
    Director: {
        type: String,
        required: true
    },
    Actors: {
        type: String,
        required: true
    },
    Plot: {
        type: String,
        required: true
    },
    imdbRating: {
        type: String,
        required: true
    },
    Year: {
        type: String,
        required: true
    },
    UpdatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Movie", movieSchema);