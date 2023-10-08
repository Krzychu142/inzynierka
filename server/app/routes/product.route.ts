import express from 'express'
import AuthMiddleware from '../middleware/Auth.middleware'
import ProductController from '../controllers/Product.controller'

const router = express.Router()

router.get('/getAllProducts', ProductController.getAllProduct)
router.post('/createProduct', AuthMiddleware.checkIsUserLoggedIn,  ProductController.createProduct)

export default router
