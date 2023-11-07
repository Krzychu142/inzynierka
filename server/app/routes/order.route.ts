import express from 'express'
import AuthMiddleware from '../middleware/Auth.middleware';
import { Role } from '../types/role.enum';

const router = express.Router()

router.post('/create', AuthMiddleware.checkIsEmployeeLoggedIn, AuthMiddleware.checkIsEmployeeHaveCorrectPermission([Role.MANAGER, Role.SALESMAN, Role.WAREHOUSEMAN]), )

export default router
