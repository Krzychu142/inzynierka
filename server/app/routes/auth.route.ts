import express from 'express'
import AuthController from '../controllers/Auth.controller'

const router = express.Router()

router.post('/register', AuthController.register)

export default router
