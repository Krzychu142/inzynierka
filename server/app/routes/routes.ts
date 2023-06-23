import express from 'express'
import employeeRoutes from './employee.route'

const router = express.Router()

router.use('/employees', employeeRoutes)

export default router
