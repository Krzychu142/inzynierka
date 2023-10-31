import express from 'express'
import employeeRoutes from './employee.route'
import productRoutes from './product.route'
import authRoutes from './auth.route'
import requestLoggerRoutes from './requestLogger.route'

const router = express.Router()

router.use('/employees', employeeRoutes)
router.use('/products', productRoutes)
router.use('/auth', authRoutes)
router.use('/operations', requestLoggerRoutes)

export default router
