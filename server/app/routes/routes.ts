import express from 'express'
import employeeRoutes from './employee.route'
import productRoutes from './product.route'

const router = express.Router()

router.use('/employees', employeeRoutes)
router.use('/products', productRoutes)

export default router
