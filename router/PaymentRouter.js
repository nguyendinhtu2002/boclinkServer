const express = require("express")
const { paymentCreate, getNhatKy, getAll } = require("../controller/PaymentController")
const { protect, admin } = require("../middlerware/AuthMiddleware")
const router = express.Router()


router.post('/',paymentCreate)
router.get('/:user',getNhatKy)
router.get('/getAll',admin,getAll)
module.exports = router
 