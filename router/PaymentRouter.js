const express = require("express")
const { paymentCreate, getNhatKy } = require("../controller/PaymentController")
const { protect } = require("../middlerware/AuthMiddleware")
const router = express.Router()


router.post('/',paymentCreate)
router.get('/:user',getNhatKy)

module.exports = router
 