import express from 'express'
import ProductController from '../controllers/Product.controller'

const router = express.Router()

router.get('/getAllProducts', ProductController.getAllProduct)
router.post('/createProduct', ProductController.createProduct)

export default router
