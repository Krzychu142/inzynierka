import express from 'express'
import AuthMiddleware from '../middleware/Auth.middleware'
import ProductController from '../controllers/Product.controller'
import { Role } from '../types/role.enum'

const router = express.Router()

router.get('/getAllProducts', ProductController.getAllProduct)
router.post('/createProduct', AuthMiddleware.checkIsEmployeeLoggedIn, AuthMiddleware.checkIsEmployeeHaveCorrectPermission([Role.MANAGER, Role.SALESMAN]), ProductController.createProduct)

export default router
