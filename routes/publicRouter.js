const express = require("express");
const router = express.Router();
const errorHandler = require('../middleware/errorHandler')
const publicController = require(`../controllers/publiccontroller`)

router.get(`/products`,publicController.getPublicData)
router.get(`/products/:id`,publicController.getPublicDataById)
router.use(errorHandler)

module.exports = router