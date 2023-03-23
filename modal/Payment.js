const mongoose = require("mongoose");


const paymentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    money:{
        type:Number,
        required:true,

    },
    content:{
        type:String,
        require:true,
    },
    moneyCu:{
        type:Number,
        required:true,
    },
    moneyTD:{
        type:Number,
        required:true,
    }
},
    {
        timestamps: true,
    }
)

const Payment = mongoose.model('Payment', paymentSchema)

module.exports = Payment;
