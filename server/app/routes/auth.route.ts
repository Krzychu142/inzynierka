import express from 'express'
import AuthController from '../controllers/Auth.controller'
import AuthMiddleware from '../middleware/Auth.middleware'
import { Role } from '../types/role.enum'

const router = express.Router()

router.post(
  '/register',
  AuthMiddleware.checkIsEmployeeLoggedIn,
  AuthMiddleware.checkIsEmployeeHaveCorrectPermission([Role.MANAGER]),
  AuthController.register,
)
router.post('/verifyEmail/:token', AuthController.verifyEmail)
router.post('/login', AuthController.login)
router.post('/forgotPassword', AuthController.forgotPassword)
router.post('/resetPassword', AuthController.resetPassword)

export default router
