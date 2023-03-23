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
    title: {
        type: String,
        required: true,
    },
    des:{
        type:String,
        required:true,
    },
    img:{
        type:String,
        required:true,
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
    },
    short_url:{
        type:String,
        require:true,
    }
},
    {
        timestamps: true,
    }
)

const FakeLink = mongoose.model('FakeLink', urlScheme)

module.exports = FakeLink;
