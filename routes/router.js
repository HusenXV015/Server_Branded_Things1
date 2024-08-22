const router = require('express').Router();

const categoryRouters = require(`./categoryRouter`)
const productRouters = require(`./productRouter`)
const userRouters = require(`./userRouter`)
const publicRouter = require(`./publicRouter`)

router.use(`/users`,userRouters)
router.use(`/categorys`, categoryRouters)
router.use(`/products`, productRouters)
router.use(`/publics`, publicRouter)


module.exports = router