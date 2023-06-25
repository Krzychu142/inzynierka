import express from 'express'
import ProductController from '../controllers/Product.controller'

const router = express.Router()

router.get('/getAllProducts', ProductController.getAllProduct)

export default router
