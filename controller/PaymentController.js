const Payment = require("../modal/Payment");
const expressAsyncHandler = require("express-async-handler");
const User = require("../modal/User");
const NapTien = require('../modal/Naptien')

const paymentCreate = expressAsyncHandler(async (req, res, next) => {
    try {
        const { so_tien, ten_bank, id_khach, ma_baoMat, moi_dung } = req.body;

        if (!so_tien || !id_khach) {
            return res.status(400).send('Thieu thong tin can thiet');
        }

        if (ma_baoMat !== 'azoview') {
            return res.status(401).send('Sai ma bao mat');
        }
        // const napTiepCheck = await NapTien.findOne({ id_khach, status: false })
        const userCheck = await User.findOne({ username: id_khach });
        if (userCheck) {
            const moneyCu = userCheck.money
            userCheck.money = userCheck.money + so_tien;
            const updatedUser = await userCheck.save();
            const payment = await Payment.create({
                money: updatedUser.money,
                moneyCu,
                moneyTD: so_tien,
                content: moi_dung,
                user: userCheck._id
            })
            if (payment) {
                res.status(201).json({
                    code: 1,
                    data: payment,
                });
            }
            else {
                res.status(400).json({ message: "Có lỗi gì đó" })

            }
        }
        else {
            res.status(400).json({ message: "User not found" })
        }
    } catch (error) {
        next(error);
    }
})


const getNhatKy = expressAsyncHandler(async (req, res, next) => {
    try {
        const checkPayment = await Payment.find({ user: req.params.user })
        if (checkPayment) {
            return res.status(200).json(checkPayment)
        }
        else {
            return res.status(404).json({ message: "User not found" })
        }
    } catch (error) {
        next(error)
    }
})
const getAll = expressAsyncHandler(async (req, res, next) => {
    try {
        const paymentCheck = await Payment.find({})
        if (paymentCheck) {
            return res.json(paymentCheck)
        }
        else {
            return res.status(400).json({ message: "Payment error" })
        }
    } catch (error) {
        next(error)
    }
})
// const NapTien = expressAsyncHandler(async (req, res, next) => {
//     try {
// const { so_tien, ten_bank, id_khach, ma_baoMat } = req.body;

// if (!so_tien || !id_khach) {
//     return res.status(400).send({ message: 'Thiếu thông tin cần thiết' });
// }

// if (ma_baoMat !== 'azoview') {
//     return res.status(401).send({ message: 'Sai mã bảo mật' });
// }
//         const UserCheck = User.findOne({ username: id_khach })
//         if(UserCheck){

//         }

//     } catch (error) {

//     }
// })
module.exports = { paymentCreate, getNhatKy, getAll }