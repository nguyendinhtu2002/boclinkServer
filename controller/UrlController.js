const Url = require("../modal/URL.js");
const expressAsyncHandler = require("express-async-handler");
const randomstring = require("randomstring");
const User = require("../modal/User.js");
const FakeLink = require("../modal/FakeLink.js");
const fs = require('fs');
const Broser = require("../modal/Broser.js");
const geoip = require('geoip-lite');


const createUrl = expressAsyncHandler(async (req, res, next) => {
    try {
        const { name, url1, url2, status, user } = req.body;
        const short_url = randomstring.generate(7)
        // const urlCheck = await Url.findOne({ name })
        const userCheck = await User.findOne({ _id: user })
        // console.log(userCheck)
        if (userCheck !== null && userCheck.hsD > 0) {
            const urlNew = await Url.create({
                name,
                user,
                url1,
                url2,
                status,
                short_url,

            });
            if (urlNew) {
                res.status(201).json({
                    code: 1,
                    short_url: urlNew.short_url,
                });
            }
            else {
                res.status(400).json({ message: "Invalid URL Data" })

            }
        }
        else {
            return res.status(400).json({ message: "Hết hạn sử dụng" })
        }
    } catch (error) {
        next(error);
    }
})

const getbyId = expressAsyncHandler(async (req, res, next) => {
    const url = await Url.find({ user: req.params.user });
    if (url) return res.status(200).json(url)
    else {
        return res.status(404).json({ error: "Invalid data" })
    }

})


const getUrl = expressAsyncHandler(async (req, res, next) => {
    try {

        const { shortURL } = req.params;
        const browser = req.useragent.browser;
        const urlCheck = await Url.find({ short_url: shortURL })
        if (urlCheck && urlCheck[0].status === "OFF") {
            urlCheck[0].count++;
            urlCheck[0].save();
            const browserCheck = await Broser.findOne({ browser, url: urlCheck[0]._id })
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            if (browserCheck) {
                browserCheck.count++;
                browserCheck.save();
                return res.json(browserCheck)

            }
            else {
                const browserStats = await Broser.create({
                    browser,
                    count: 1,
                    user: urlCheck[0].user,
                    url: urlCheck[0]._id,
                    ip,
                    userAgent: req.headers['user-agent'],
                })
                if (!browserStats) {
                    return res.status(404).json({ message: "Fail" })
                }
            }
            return res.status(200).json({ "code": 1, "url": urlCheck[0].url2 });

        }
        else {
            return res.status(404).send("URL not found");
        }
    } catch (error) {

    }
})

const getUrlById = expressAsyncHandler(async (req, res, next) => {
    try {
        const url = await Url.findOne({ _id: req.params.id })
        if (url === null) {
            return res.status(404).send({ error: "Err", message: "Url not found" })
        }
        else {
            return res.status(200).json(url);
        }
    } catch (error) {
        next(error);
    }
})

const updateStatus = expressAsyncHandler(async (req, res, next) => {
    try {
        const data = req.body;

        const url = await Url.findOne({ _id: req.params.id })
        if (url === null) {
            return res.status(404).send({ error: "Err", message: "Url not found" })
        }
        else {

            const updatedUrl = await Url.findByIdAndUpdate(url._id, data, { new: true })
            return res.status(200).json({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedUrl
            })
        }
    } catch (error) {
        next(error);
    }
})

const craeteUrlFake = expressAsyncHandler(async (req, res, next) => {
    try {
        const { user, url1, title, des, img, url2, status } = req.body
        const short_url = randomstring.generate(7)

        const userCheck = await User.findOne({ _id: user })
        if (userCheck.hsD === 0 ) {
            return res.status(404).send({ error: "Err", message: "Hết hạn sử dụng" })
        }
    
        else {
            const urlNew = await FakeLink.create({
                title,
                user,
                url1,
                url2,
                status,
                des,
                img: img,
                short_url

            });
            if (urlNew) {
                res.status(201).json({
                    code: 1,
                    short_url: urlNew,
                });
            }
            else {
                res.status(400).json({ message: "Invalid URL Data" })

            }
        }

    } catch (error) {
        next(error)
    }
})

const getURlFake = expressAsyncHandler(async (req, res, next) => {
    try {
        const url = await FakeLink.find({ user: req.params.user })
        if (url === null) {
            return res.status(404).send({ error: "Err", message: "Url not found" })
        }
        else {
            return res.status(200).json(url);
        }
    } catch (error) {
        next(error);
    }
})
const getURLGoc = expressAsyncHandler(async (req, res, next) => {
    try {
        const urlCheck = await FakeLink.findOne({ short_url: req.params.shortURL })
        if (urlCheck !== null) {
            return res.json(urlCheck.url2)
        }
        else {
            return res.status(400).json({ message: "URl not found" })
        }
    } catch (error) {

    }
})
const getLinkFake = expressAsyncHandler(async (req, res, next) => {
    try {
        const { shortURL } = req.params;
        const urlCheck = await FakeLink.findOne({ short_url: shortURL })
        if (urlCheck !== null && urlCheck.status === "OFF") {
            return res.end(`<html>
<head>

    <meta charset="utf-8" />

    <meta name="viewport" content="width=device-width,minimum-scale=1" />

    <meta name="twitter:card" content="summary_large_image" />

    <meta property="og:image" content="http://boclink.azview.us/images/${urlCheck.img}" />

    <meta name="twitter:image:src" content="http://boclink.azview.us/images/${urlCheck.img}" />

    <meta property="og:title" content=${urlCheck.title} />

    <meta name="twitter:title" content=${urlCheck.title} />

    <meta property="og:description" content=${urlCheck.des} />

    <meta name="twitter:description" content=${urlCheck.des} />

    <meta name="twitter:app:country" content="US" />

    <script src="https://code.jquery.com/jquery-3.6.0.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
</head>

<body>
    <input type="hidden" id="url" value=${urlCheck.short_url} class="form-control">
    <div id="thongbao"></div>
    <script type="text/javascript">
    var data = {
        shortURL: ${urlCheck.shortURL}
    };
        function load_tinnhan() {
            $.ajax({
                url: "https://boclink.azview.us/api/v1/shorten/getURLGoc/${urlCheck.short_url}",
                type: "GET",
                dateType: "text",
                success: function (n) {
                    console.log(n)
                    location.href = n;
                    //$("#thongbao").html(n);
                }
            });
        }
        setInterval(function () { $('#thongbao').load(load_tinnhan()); }, 1000);
    </script>
    <script src="/cdn-cgi/scripts/7d0fa10a/cloudflare-static/rocket-loader.min.js"
        data-cf-settings="d8c170912f15bea4b38a4c5b-|49" defer></script>
</body>

</html>
            `)
        }
        else {
            return res.status(404).json({ message: "Loi" })
        }
    } catch (error) {
        next(error)
    }
})
const deleteUrl = expressAsyncHandler(async (req, res, next) => {
    try {

        const user = await Url.findById(req.params.id);
        if (user) {
            await user.remove();
            return res.json({ success: true })
        }
        else return res.json({ success: false })
    } catch (error) {
        next(error);
    }
})
const deleteUrlFake = expressAsyncHandler(async (req, res, next) => {
    try {

        const fakeLink = await FakeLink.findById(req.params.id);

        if (fakeLink) {
            fs.unlink(`./uploads/${fakeLink.img}`, (err) => {
                if (err) {
                    console.log(err)
                }
            })
            await fakeLink.remove();
            return res.json({ success: true })
        }
        else return res.json({ success: false })
    } catch (error) {
        next(error);
    }
})
const getUrlfakeById = expressAsyncHandler(async (req, res, next) => {
    try {
        const url = await FakeLink.findOne({ _id: req.params.id })
        if (url === null) {
            return res.status(404).send({ error: "Err", message: "Url not found" })
        }
        else {
            return res.status(200).json(url);
        }
    } catch (error) {
        next(error);
    }
})
const updateUrlFake = expressAsyncHandler(async (req, res, next) => {
    try {
        const data = req.body;

        const url = await FakeLink.findOne({ _id: req.params.id })
        if (url === null) {
            return res.status(404).send({ error: "Err", message: "Url not found" })
        }
        else {

            const updatedUrl = await FakeLink.findByIdAndUpdate(url._id, data, { new: true })
            return res.status(200).json({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedUrl
            })
        }
    } catch (error) {
        next(error);
    }
})

const getAllUser = expressAsyncHandler(async (req, res, next) => {
    try {
        const userCheck = await Url.find({})
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
module.exports = { createUrl, getUrl, getbyId, getUrlById, updateStatus, deleteUrl, craeteUrlFake, getURlFake, getLinkFake, getURLGoc, deleteUrlFake, getUrlfakeById, updateUrlFake,getAllUser }
