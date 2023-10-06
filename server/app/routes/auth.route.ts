import express from 'express'
import AuthController from '../controllers/Auth.controller'

const router = express.Router()

router.post('/register', AuthController.register)
router.post('/verifyEmail/:token', AuthController.verifyEmail)
router.post('/login', AuthController.login)
router.post('/forgotPassword', AuthController.forgotPassword)
router.post('/resetPassword/:token', AuthController.resetPassword)

export default router
