const express = require("express")
const { createUrl, getUrl, getbyId, getUrlById, updateStatus, deleteUrl, craeteUrlFake, getURlFake, getLinkFake, getURLGoc, deleteUrlFake, getUrlfakeById, updateUrlFake, getAllUser } = require("../controller/UrlController")
const { protect, admin } = require("../middlerware/AuthMiddleware")
const { chanbot } = require("../middlerware/chanbot")
const router = express.Router()
const fs = require('fs')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
    limits: {
        fileSize: 1024 * 1024 * 5 // giới hạn kích thước tệp tin là 5MB
    }
});
const upload = multer({ storage: storage });

router.post('/', createUrl)
router.get('/:shortURL', chanbot, getUrl)
router.get("/:user/getALL", getbyId)
router.get("/:id/getById", getUrlById)
router.put("/:id", updateStatus)
router.delete('/:id', deleteUrl)
router.post('/urlfake', upload.single('image'), craeteUrlFake)
router.get('/:user/getLinkFake', getURlFake)
router.get('/:shortURL/link', getLinkFake)
router.get('/getURLGoc/:shortURL', getURLGoc)
router.delete('/:id/linkfake', deleteUrlFake)
router.get('/:id/getByIdFake', getUrlfakeById)
router.put('/:id/Fake', updateUrlFake)
router.get('/getAll/Admin',protect,admin,getAllUser)
module.exports = router