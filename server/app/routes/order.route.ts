import express from 'express'
import AuthMiddleware from '../middleware/Auth.middleware';
import { Role } from '../types/role.enum';
import OrderController from '../controllers/Order.controller';

const router = express.Router()

router.post('/create', AuthMiddleware.checkIsEmployeeLoggedIn, AuthMiddleware.checkIsEmployeeHaveCorrectPermission([Role.MANAGER, Role.SALESMAN, Role.WAREHOUSEMAN]), OrderController.createOrder)
router.get('/getOrdersByClient/:email', AuthMiddleware.checkIsEmployeeLoggedIn, AuthMiddleware.checkIsEmployeeHaveCorrectPermission([Role.MANAGER, Role.SALESMAN, Role.WAREHOUSEMAN]), OrderController.getOrdersByClient)
router.get('/get', AuthMiddleware.checkIsEmployeeLoggedIn, AuthMiddleware.checkIsEmployeeHaveCorrectPermission([Role.MANAGER, Role.SALESMAN, Role.WAREHOUSEMAN]), OrderController.getAllOrders)

export default router
