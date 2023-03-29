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
                maxAge: 60 * 60 * 24,
                secure: true,
                sameSite: 'strict',
                domain:"makemoneymmo.com"
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
                    id: user.id,
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
const getAllUser = expressAsyncHandler(async (req, res, next) => {
    try {
        const userCheck = await User.find({})
        if (userCheck) {
            return res.json(userCheck)
        }
        else {
            return res.status(400).json({ message: "USer not admin" })
        }
    } catch (error) {
        next(error)
    }
})

module.exports = { register, Login, RefreshTokenController, Logout, getUserById, updateProfile, updatePassword, orderUrl, getAllUser } 
