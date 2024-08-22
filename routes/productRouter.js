const express = require("express");
const router = express.Router();
const upload = require(`../utils/multer`)

const authentication = require('../middleware/authentication')
const authorization = require('../middleware/authorization')
const errorHandler = require('../middleware/errorHandler')
const productController = require(`../controllers/productcontroller`)

router.use(authentication)
router.get(`/`,productController.read)
router.get(`/:id`,authorization,productController.readById)
router.post(`/add`,authorization,productController.add)
router.put(`/:id`,authorization,productController.edit)
router.delete(`/:id`,authorization,productController.delete)
router.patch('/:id/image', authorization, upload.single('imgUrl'), productController.updateImage);
router.use(errorHandler)

module.exports = router