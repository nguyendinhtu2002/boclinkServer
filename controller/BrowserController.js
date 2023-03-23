const Broser = require("../modal/Broser");
const User = require("../modal/User");
const expressAsyncHandler = require("express-async-handler");
const useragent = require('express-useragent');


const createBrowser = expressAsyncHandler(async (req, res, next) => {
    const browser = req.useragent.browser;
    const { count, user, url } = req.body
    try {
        const browserCheck = await Broser.findOne({ browser, url })
        if (browserCheck) {
            browserCheck.count++;
            browserCheck.save();
            return res.json(browserCheck)

        }
        else {
            const browserStats = await Broser.create({
                browser,
                count: 1,
                user,
                url,
            });

            if (browserStats) {
                return res.json(browserStats)
            }
            else {
                return res.status(404).json({ status: "Fail" })
            }

        }
    } catch (error) {
        next(error);
    }
})

const getBrowser = expressAsyncHandler(async (req, res, next) => {
    try {
        const browserCheck = await Broser.find({ url: req.params.url });
        if (browserCheck) {
            return res.json(browserCheck)
        }
        else {
            return res.status(404).json({ message: "Fail" })
        }
    } catch (error) {
        next(error)
    }
})
module.exports = { createBrowser,getBrowser }