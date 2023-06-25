import { Request, Response } from 'express'
import EmployeeService from '../services/Employee.service'
import errorHandler from '../helpers/errorHandler'

class EmployeeController {
  static async getAllEmployees(req: Request, res: Response): Promise<void> {
    try {
      const employees = await EmployeeService.getAllEmployees()
      res.json(employees)
    } catch (error: unknown) {
      const errorMessages = errorHandler(error)
      res.status(500).json(errorMessages)
    }
  }
}

export default EmployeeController
