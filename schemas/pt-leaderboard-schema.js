const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("pt-leaderboard-schema", schema, "pt-leaderboard-schema");