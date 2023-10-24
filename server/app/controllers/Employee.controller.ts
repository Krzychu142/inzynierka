import { Request, Response } from 'express'
import EmployeeService from '../services/Employee.service'
import ErrorsHandlers from '../utils/helpers/ErrorsHandlers'

class EmployeeController {
  static async getAllEmployees(req: Request, res: Response): Promise<void> {
    try {
      const employees = await EmployeeService.getAllEmployees()
      res.json(employees)
    } catch (error: unknown) {
      res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
    }
  }

  static async getSingleEmployee(req: Request, res: Response): Promise<void> 
  {
    try {
      if(!req.params.id) {
        res.status(400).json({ message: 'The id parameter is missing' }) 
      } else {
        const result = await EmployeeService.getSingleEmployee(req.params.id); 
        if (!result) {
          res.status(404).json({ message: "Employee doesn't exist" })
        } else {
          res.status(200).json(result)
        }
      }
    } catch (error: unknown) {
      res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
    }
  }

  static async deleteEmployee(req: Request, res: Response): Promise<void> {
    try {
      if(!req.body.email) {
        res.status(400).json({ message: 'The email parameter is missing' }) 
      } else {
        const result = await EmployeeService.deleteSingleEmployee(req.body.email)
        if (result.deletedCount === 0) {
          res.status(404).json({ message: 'Employee not found' }) 
        } else {
          res.status(201).json({ message: 'Employee deleted successful'})
        }
      }
    } catch (error) {
      res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
    }
  }
}

export default EmployeeController
