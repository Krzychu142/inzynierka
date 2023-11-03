import express from 'express'
import EmployeeController from '../controllers/Employee.controller'
import AuthMiddleware from '../middleware/Auth.middleware';
import { Role } from '../types/role.enum';

const router = express.Router()

router.get('/get', AuthMiddleware.checkIsEmployeeLoggedIn, AuthMiddleware.checkIsEmployeeHaveCorrectPermission([Role.MANAGER, Role.SALESMAN]), EmployeeController.getAllEmployees);
// there is no /create route, to create new employee we use register
router.delete('/delete', AuthMiddleware.checkIsEmployeeLoggedIn, AuthMiddleware.checkIsEmployeeHaveCorrectPermission([Role.MANAGER]), EmployeeController.deleteEmployee)
router.get('/:id', AuthMiddleware.checkIsEmployeeLoggedIn, AuthMiddleware.checkIsEmployeeHaveCorrectPermission([Role.MANAGER]), EmployeeController.getSingleEmployee)
router.put('/:id', AuthMiddleware.checkIsEmployeeLoggedIn, AuthMiddleware.checkIsEmployeeHaveCorrectPermission([Role.MANAGER]), EmployeeController.editEmployee)

export default router
