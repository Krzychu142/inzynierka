import express from 'express'
import AuthController from '../controllers/Auth.controller'

const router = express.Router()

router.post('/register', AuthController.register)
router.get('/verifyEmail/:token', AuthController.verifyEmail)
// email verification

export default router
