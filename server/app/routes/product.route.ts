import express from 'express'
import AuthMiddleware from '../middleware/Auth.middleware'
import ProductController from '../controllers/Product.controller'
import { Role } from '../types/role.enum'

const router = express.Router()

router.get('/get', AuthMiddleware.checkIsEmployeeLoggedIn, ProductController.getAllProduct)
router.post('/create', AuthMiddleware.checkIsEmployeeLoggedIn, AuthMiddleware.checkIsEmployeeHaveCorrectPermission([Role.WAREHOUSEMAN, Role.MANAGER, Role.SALESMAN]), ProductController.createProduct)
router.delete('/delete', AuthMiddleware.checkIsEmployeeLoggedIn, AuthMiddleware.checkIsEmployeeHaveCorrectPermission([Role.MANAGER, Role.SALESMAN]), ProductController.deleteProduct)
router.get('/:id', AuthMiddleware.checkIsEmployeeLoggedIn, AuthMiddleware.checkIsEmployeeHaveCorrectPermission([Role.WAREHOUSEMAN, Role.MANAGER, Role.SALESMAN]), ProductController.getSingleProduct)
router.put('/:id', AuthMiddleware.checkIsEmployeeLoggedIn, AuthMiddleware.checkIsEmployeeHaveCorrectPermission([Role.WAREHOUSEMAN, Role.MANAGER, Role.SALESMAN]), ProductController.editProduct)

export default router
