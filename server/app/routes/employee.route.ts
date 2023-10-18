import express from 'express'
import EmployeeController from '../controllers/Employee.controller'

const router = express.Router()

router.get('/get', EmployeeController.getAllEmployees)

export default router
