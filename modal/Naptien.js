const mongoose = require("mongoose");


const naptienSchema = mongoose.Schema({
    id: Number,
    name_bank: {
        type: String,
        require: true,
    },
    money: {
        type: Number,
        require: true,
    },
    id_khach: {
        type: String,
        require: true,
    },
    content_bank: {
        type: String,
        require: true,
    },
    trans_id: {
        type: String,
        require: true,
    },
    time_bank: {
        type: String,
        require: true,
    },
    time_callback: {
        type: Date,
        require: true,
    },
},
    {
        timestamps: true,
    }
)

const NapTien = mongoose.model('NapTien', naptienSchema)

module.exports = NapTien;
