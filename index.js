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

// var corsOptions = {
//     origin: 'http://localhost:3000',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
app.use(cors({
    origin: "https://makemoneymmo.com",
    credentials: true
}));

app.set('trust proxy', true);
app.get('/test/libary.js', (req, res) => {
    res.sendFile(path.resolve('libary.js'));
})

app.get('/images/:name', (req, res) => {
    res.sendFile(path.resolve(`./uploads/${req.params.name}`))
})

app.use('/api/v1/users', UserRouter)
app.use('/api/v1/shorten', UrlRouter)
app.use('/api/v1/payment', PaymentRouter)


app.use('/api/v1/browser', BrowserRouter)
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`)
})