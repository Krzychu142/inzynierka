import { Request, Response } from 'express'
import EmployeeService from '../services/Employee.service'

class EmployeeController {
  static async getAllEmployees(req: Request, res: Response): Promise<void> {
    const employees = await EmployeeService.getAllEmployees()
    res.json(employees)
  }
}

export default EmployeeController
