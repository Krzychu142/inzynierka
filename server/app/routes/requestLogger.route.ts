import express from 'express'
import RequestLoggerController from '../controllers/RequestLogger.controller'
import AuthMiddleware from '../middleware/Auth.middleware'


const router = express.Router()

router.get('/get', AuthMiddleware.checkIsEmployeeLoggedIn, RequestLoggerController.getAllOperations)

export default router