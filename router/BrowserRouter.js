const express = require("express")
const { createBrowser, getBrowser } = require("../controller/BrowserController")
const router = express.Router()


router.post('/', createBrowser)
router.get('/:url', getBrowser)
module.exports = router