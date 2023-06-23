import express from 'express'
import EmployeeController from '../controllers/Employee.controller'

const router = express.Router()

router.get('/getAllEmployees', EmployeeController.getAllEmployees)

export default router
