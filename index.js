const express = require('express')
const app = express()
const dotenv = require("dotenv");
const cors = require("cors")
const bodyParser = require('body-parser')
const path = require("path");
const connectDatabase = require("./config/MongoDb.js");
const UrlRouter = require("./router/UrlRouter.js")
const UserRouter = require('./router/User.js')
const PaymentRouter = require("./router/PaymentRouter.js")
const BrowserRouter = require("./router/BrowserRouter.js")
const useragent = require('express-useragent');
const cron = require("node-cron");
const axios = require('axios');
const NapTien = require('./modal/Naptien')
const User = require("./modal/User");

const cookieParser = require('cookie-parser');
dotenv.config();
connectDatabase();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(useragent.express());

const saveDataToMongoDB = async (data) => {
    try {

        for (const item of data) {
            // Kiểm tra xem document đã tồn tại trong database chưa
            const existingDocument = await NapTien.findOne({ id: item.id });
            if (existingDocument) {
                continue;
            }        //   // Nếu chưa tồn tại, tạo một instance của model và lưu vào MongoDB
            const newData = new NapTien(item);
            await newData.save();
        }
    } catch (error) {
        console.error(`Failed to save data to MongoDB: ${error}`);
    }
};
const fetchDataFromAPI = async () => {
    const response = await axios.get('https://botsms.net/api/his_autobank_limit?url_callBack=https://api.azview.us/api/transaction&limit=10');
    const data = response.data;
    return data;
};
const task = async () => {
    try {
        const data = await fetchDataFromAPI();
        await saveDataToMongoDB(data);
    } catch (error) {
        console.error(`Failed to fetch data from API: ${error}`);
    }
};

// cron.schedule('0 0 0 * * *', function () {

//     // Giảm giá trị của trường "hsD" đi 1 mỗi ngày
//     User.updateMany({},
//         [
//             {
//                 $set: {
//                     hsD: {
//                         $cond: {
//                             if: { $gt: ["$hsD", 0] },
//                             then: { $subtract: ["$hsD", 1] },
//                             else: "$hsD"
//                         }
//                     }
//                 }
//             }
//         ]
//         , function (err, res) {
//             if (err) console.log(err);
//             // console.log(" đơn hàng đã được cập nhật.");

//         });

// });

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

app.get('/test/libary.js', (req, res) => {
    res.sendFile(path.resolve('libary.js'));
})

app.get('/images/:name', (req, res) => {
    res.sendFile(path.resolve(`./uploads/${req.params.name}`))
})
app.get('/', function (req, res) {
    const clientIp = req.clientIp;
    console.log(clientIp);
});
app.use('/api/v1/users', UserRouter)
app.use('/api/v1/shorten', UrlRouter)
app.use('/api/v1/payment', PaymentRouter)
app.post('/api/transaction', (req, res) => {
    const { so_tien, ten_bank, id_khach, ma_baoMat } = req.body;

    if (!so_tien || !id_khach) {
        return res.status(400).send('Thiếu thông tin cần thiết');
    }

    if (ma_baoMat !== '3483898374') {
        return res.status(401).send('Sai mã bảo mật');
    }

    // Thực hiện các tác vụ tiếp theo

    // res.send('Yêu cầu của bạn đã được xử lý thành công');
});
cron.schedule('*/30 * * * * *', task);

app.use('/api/v1/browser', BrowserRouter)
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`)
})