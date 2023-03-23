const mongoose = require("mongoose");


const browserStatsSchema = new mongoose.Schema({
    browser: {
        type: String,
        require: true,
    },
    count: {
        type: Number,
        require: true,
    },
    ip: {
        type: String,

    },
    userAgent: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    url: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Url'
    }
},
    {
        timestamps: true,
    }
);

const Broser = mongoose.model('Broser', browserStatsSchema)

module.exports = Broser;



