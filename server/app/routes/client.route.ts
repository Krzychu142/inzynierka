import express from 'express'
import AuthMiddleware from '../middleware/Auth.middleware';
import { Role } from '../types/role.enum';
import ClientController from '../controllers/Client.controller';

const router = express.Router()

router.get("/get", AuthMiddleware.checkIsEmployeeLoggedIn, AuthMiddleware.checkIsEmployeeHaveCorrectPermission([Role.MANAGER, Role.SALESMAN]), ClientController.getAllClients)
router.post('/create', AuthMiddleware.checkIsEmployeeLoggedIn, AuthMiddleware.checkIsEmployeeHaveCorrectPermission([Role.MANAGER, Role.SALESMAN]), ClientController.createClient)
router.delete('/delete', AuthMiddleware.checkIsEmployeeLoggedIn, AuthMiddleware.checkIsEmployeeHaveCorrectPermission([Role.MANAGER, Role.SALESMAN]), ClientController.deleteClient)
router.get('/:id', AuthMiddleware.checkIsEmployeeLoggedIn, AuthMiddleware.checkIsEmployeeHaveCorrectPermission([Role.MANAGER, Role.SALESMAN]), ClientController.getSingleClient)

export default router
