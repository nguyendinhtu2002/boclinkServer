const Payment = require("../modal/Payment");
const expressAsyncHandler = require("express-async-handler");
const User = require("../modal/User");

const paymentCreate = expressAsyncHandler(async (req, res, next) => {
    try {
        const { so_tien, ten_bank, id_khach, ma_baoMat,moi_dung } = req.body;

        if (!so_tien || !id_khach) {
            return res.status(400).send({ message: 'Thiếu thông tin cần thiết' });
        }

        if (ma_baoMat !== 'azoview') {
            return res.status(401).send({ message: 'Sai mã bảo mật' });
        }

        const userCheck = await User.findOne({ username: id_khach });
        if (userCheck) {
           
            userCheck.money = userCheck.money + so_tien;
            const updatedUser = await userCheck.save();
            const payment = await Payment.create({
                money: updatedUser.money,
                moneyCu,
                moneyTD: money,
                content:moi_dung,
                user: userCheck._id
            })


            if (payment) {
                res.status(201).json({
                    code: 1,
                    data: payment,
                });
            }
            else {
                res.status(400).json({ message: "Invalid URL Data" })

            }
        }
        else {
            res.status(400).json({ message: "Invalid User Data" })

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
module.exports = { paymentCreate, getNhatKy }