// const express = require('express');
// const User = require('../modal/userModal');
// const bcrypt = require('bcryptjs');
// const expressAsyncHandler = require('express-async-handler');
// const {  generateToken } = require('../utils/generateToken');

const express = require('express');
const User = require("../modal/User.js");
const bcrypt = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const { generateToken, refreshToken } = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const Payment = require('../modal/Payment.js');

// const randomstring = require ("randomstring")
// const nodemailer = require ("nodemailer")


let refreshTokens = [];

const register = expressAsyncHandler(async (req, res, next) => {
    try {

        const { username, name, email, phone, password } = req.body;
        const userExists = await User.findOne({ email });
        const usernameExists = await User.findOne({ username });

        if (!username || !name || !email || !password) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        if (userExists) {
            return res.status(400).json({ message: "User already exists" })
        }
        if (usernameExists) {
            return res.status(400).json({ message: "User Name already exists" })

        }

        const user = await User.create({
            name,
            email,
            username,
            password,
            // token: generateToken(user._id),
            // refreshToken: refreshToken(user._id),

        });

        if (user) {
            // res.cookie('refresh_token', refreshToken(user._id), {
            //     httpOnly: true,
            //     secure: false,
            //     sameSite: 'strict',
            //     path: '/'
            // })
            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                sex: user.sex,
                money: user.money,
                sumMoney: user.sumMoney,
                chiTieu: user.chiTieu,
                hsD: user.hsD,
                username: user.username,
                // token: generateToken(user._id),
                // refreshToken: refreshToken(user._id),
            });
        } else {
            res.status(400).json({ message: "Invalid User Data" })

        }


    } catch (error) {
        next(error);
    }
})

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { username, password } = userLogin
        try {
            const checkUser = await User.findOne({
                username: username
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)

            if (!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: 'The password or user is incorrect'
                })
            }
            const access_token = await generateToken({
                id: checkUser.id,
            })

            const refresh_token = await refreshToken({
                id: checkUser.id,
            })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                access_token,
                refresh_token
            })
        } catch (e) {
            reject(e)
        }
    })
}
const Login = expressAsyncHandler(async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user && (await user.matchPassword(password))) {
            const response = await loginUser(req.body)
            // console.log(response)

            const { refresh_token, ...newReponse } = response
            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                path: '/'
            })
            return res.status(200).json(newReponse)


        } else {
            return res.status(401).json({ error: 'Invalid Email or Password' })
        }
    } catch (error) {
        next(error);
    }
})

const refreshTokenService = (token) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
                if (err) {
                    console.log('err', err)
                    resolve({
                        status: 'ERR',
                        message: 'The authemtication'
                    })
                }
                const access_token = await generateToken({
                    id: user?.id,
                })
                resolve({
                    status: 'OK',
                    message: 'SUCESS',
                    access_token
                })
            })
        } catch (e) {
            reject(e)
        }
    })
}


const RefreshTokenController = expressAsyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.refresh_token
        if (!token) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }
        const response = await refreshTokenService(token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
})
const Logout = expressAsyncHandler(async (req, res, next) => {
    try {
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'OK',
            message: 'Logged out successfully'
        })
        // const RefreshToken = req.body.token;
        // refreshTokens = refreshTokens.filter((token) => token === RefreshToken);
        // res.status(200).json("You logged out successfully.");


    } catch (error) {
        next(error);
    }
})
// const forgotPassword = expressAsyncHandler(async (req, res, next) => {
//     try {
//         const { email } = req.body;
//         const user = await User.findOne({ email });
//         if (user) {
//             const paswordNew = randomstring.generate(10);
//             user.password = paswordNew;
//             const updatedUser = await user.save();
//             var transporter = nodemailer.createTransport({
//                 service: 'gmail',
//                 auth: {
//                     user: 'nguyendinhtu11022002@gmail.com',
//                     pass: 'dipotwokkbgjlryq'
//                 }
//             });

//             var mailOptions = {
//                 from: '1dg.com',
//                 to: email,
//                 subject: 'Password reset',
//                 text: `New password: ${paswordNew}
// You must change password at next signin
//                 `
//             };

//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     console.log(error);
//                 } else {
//                     console.log('Email sent: ' + info.response);
//                 }
//             });
//             res.json({ message: "Check your email inbox to get new password." })
//         }
//         else {
//             res.json({ message: "User not exists" })
//         }
//     } catch (error) {
//         next(error);
//     }
// })
const getUserById = expressAsyncHandler(async (req, res, next) => {
    try {

        const user = await User.findById(req.params._id);
        if (user) {
            res.json(
                {
                    status: 'OK',
                    message: 'SUCESS',
                    data: {
                        phone: user.phone,
                        sex: user.sex,
                        money: user.money,
                        sumMoney: user.sumMoney,
                        chiTieu: user.chiTieu,
                        hsD: user.hsD,
                        username: user.username,
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        isAdmin: user.isAdmin,
                        createdAt: user.createdAt,
                    }
                });
        } else {
            res.status(404);
            throw new Error("User not found");
        }
    } catch (error) {
        next(error)
    }
})

const updateProfile = expressAsyncHandler(async (req, res, next) => {
    try {

        const data = req.body;

        if (data.phone === "" || data.name === "" || data.email === "") {
            return res.status(404).json({ error: "Không được bỏ trống" })
        }
        const user = await User.findOne({ _id: req.params.id });

        if (user) {
            const updatedUser = await User.findByIdAndUpdate(user._id, data, { new: true })
            return res.status(200).json({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedUser
            })
        } else {
            res.status(404).json({
                status: 'ERROR',
                message: "User not found",
            });
        }
    } catch (error) {
        next(error);
    }
})
const updatePassword = expressAsyncHandler(async (req, res, next) => {
    try {

        const { passwordOld, passwordNew } = req.body;

        const user = await User.findOne({ _id: req.params.id });

        if (user) {
            // const updatedUser = await User.findByIdAndUpdate(user._id, data, { new: true })
            // return res.status(200).json({
            //     status: 'OK',
            //     message: 'SUCCESS',
            //     data: updatedUser
            // })
            const checkPassword = await (user.matchPassword(passwordOld))
            if ((!checkPassword)) {
                res.status(400).json({ message: 'Password incorrect' });
            }
            else {
                if (passwordNew) {
                    user.password = passwordNew;
                }

                const updatedUser = await user.save();
                res.json({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: updatedUser
                });
            }
        } else {
            res.status(404).json({
                status: 'ERROR',
                message: "User not found",
            });
        }
    } catch (error) {
        next(error);
    }
})
const orderUrl = expressAsyncHandler(async (req, res, next) => {
    const { money, content } = req.body
    const id = req.params.id
    const userCheck = await User.findOne({ _id: id })
    if (userCheck) {
        if (userCheck.money - money < 0) {
            return res.status(404).json({ message: "Không đủ tiền vui lòng nạp thêm!" })
        }
        else {
            const payment = await Payment.create({
                money: userCheck.money - money,
                moneyCu: userCheck.money,
                moneyTD: money,
                content,
                user: userCheck._id
            })
            userCheck.money = userCheck.money - money
            userCheck.hsD += 365
            const updatedUser = await userCheck.save();
            if (updatedUser) {
                res.status(201).json({
                    code: 1,
                    data: updatedUser,
                });
            }
            else {
                res.status(400).json({ message: "Invalid URL Data" })

            }
        }
    }
    else {
        return res.status(401).json({ error: 'User not found' })
    }
})
// const updateMoney = expressAsyncHandler(async (req, res, next) => {
//     try {

//         const user = await User.findById(req.user._id);
//         const { money } = req.body;
//         if (user) {
//             if (money) {
//                 user.money = money;
//             }
//             const updatedUser = await user.save();
//             res.json({
//                 _id: updatedUser._id,
//                 token: generateToken(updatedUser._id),
//             });

//         } else {
//             res.status(404);
//             throw new Error("User not found");
//         }
//     } catch (error) {
//         next(error);
//     }
// })

// const getAllUsers = expressAsyncHandler(async (req, res) => {
//     try {

//         const users = await User.find({});
//         res.json(users);
//     } catch (error) {
//         next(error);
//     }
// })

// const deleteUserById = expressAsyncHandler(async (req, res, next) => {
//     try {
//         res.setHeader('Access-Control-Allow-Origin', '*');

//         const user = await User.findById(req.params._id);
//         if (user) {
//             await user.remove();
//             return res.json({ success: true })
//         }
//         else return res.json({ success: false })
//     } catch (error) {
//         next(error);
//     }
// })

// const updateUser = expressAsyncHandler(async (req, res) => {
//     const { money, isAdmin } = req.body;

//     const user = await User.findById(req.user._id);
//     if (user) {
//         user.name = user.name;
//         user.email = user.email;
//         const updatedUser = await user.save();
//         res.json(updatedUser);
//     } else {
//         res.status(404);
//         throw new Error("User not found");
//     }
// })
// const LoginAdmin = expressAsyncHandler(async (req, res, next) => {
//     try {
//         const { email, password } = req.body;

//         const user = await User.findOne({ email });
//         console.log(user);
//         if (user && (await user.matchPassword(password))) {
//             res.json({
//                 _id: user._id,
//                 isAdmin: user.isAdmin,
//                 token: generateToken(user._id),
//                 createdAt: user.createdAt,
//             });
//         } else {
//             res.status(401).json({ error: 'Invalid Email or Password' })
//         }
//     } catch (error) {
//         next(error);
//     }
// })
// const getApiKey = expressAsyncHandler(async (req, res, next) => {
//     try {
//         const user = await User.findById(req.params._id);
//         if (user) {
//             return res.json({ apiKey: user.apiKey })
//         }
//         else {
//             return res.status(404).json({ error: 'Not Found' });
//         }
//     } catch (error) {
//         next(error);
//     }
// })
// const ChangeApiKey = expressAsyncHandler(async (req, res, next) => {
//     try {
//         const { apiKey } = req.body;
//         const user = await User.findById(req.params._id);
//         if (user) {
//             user.apiKey = apiKey;
//             const updatedKey = await user.save();
//             res.json({ apiKey: updatedKey.apiKey })
//         }
//     } catch (error) {
//         next(error);
//     }
// })
module.exports = { register, Login, RefreshTokenController, Logout, getUserById, updateProfile, updatePassword, orderUrl } 
