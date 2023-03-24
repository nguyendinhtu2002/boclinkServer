// const express = require("express")
// const router = express.Router()

const express = require("express")
const router = express.Router()
const { register, Login, updateProfile, updateMoney, getUserById, deleteUserById, updateUser, LoginAdmin, getAllUsers, getApiKey, ChangeApiKey, forgotPassword, RefreshTokenController, Logout, updatePassword, orderUrl, getAllUser } = require("../controller/UserContoller")
const { protect, admin } = require("../middlerware/AuthMiddleware")

router.post("/register", register)
router.post("/login", Login)
router.post('/refresh_token', RefreshTokenController)
router.post('/logout', Logout)
router.get("/:_id", protect, getUserById)
router.put("/updateProfile/:id", protect, updateProfile)
router.put("/:id/updatePassword", protect, updatePassword)
router.post('/payment/:id', protect, orderUrl)
router.get('/:id/getAll', admin, getAllUser)

// router.post("/forgotPassword",forgotPassword)
// router.put("/updateProfile", updateProfile)
// router.get("/:_id/apiKey",getApiKey)
// router.put("/:_id/apiKey",ChangeApiKey)
// router.put("/money",updateMoney)
// router.delete("/:_id",deleteUserById)
// router.put("/:id",updateUser)
// router.post("/loginAdm",LoginAdmin)

module.exports = router
