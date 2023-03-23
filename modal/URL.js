const mongoose = require("mongoose");


const urlScheme = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    url1: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    url2: {
        type: String,
        required: true,
    },
    short_url: {
        type: String,
        require: true,
    },
    status: {
        type: String,
        default: 'ON'
    },
    count: {
        type: Number,
        default: 0
    }
},
    {
        timestamps: true,
    }
)

const Url = mongoose.model('Url', urlScheme)

module.exports = Url;
