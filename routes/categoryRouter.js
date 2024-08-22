const express = require("express");
const router = express.Router();

const authentication = require('../middleware/authentication')
const authorization = require('../middleware/authorization')
const errorHandler = require('../middleware/errorHandler')
const categoryController = require(`../controllers/categorycontroller`)

router.use(authentication)
router.get(`/`, categoryController.read)
router.post(`/add`,authorization,categoryController.add)
router.delete(`/:id`,authorization,categoryController.delete)

router.use(errorHandler)

module.exports = router