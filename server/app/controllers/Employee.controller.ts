import { Request, Response } from 'express'
import EmployeeService from '../services/Employee.service'
import ErrorsHandlers from '../utils/helpers/ErrorsHandlers'
import ensureIdExists from '../utils/helpers/ensureIdExists'
import CustomError from '../utils/helpers/CustomError'

class EmployeeController {
  static async getAllEmployees(req: Request, res: Response): Promise<void> {
    try {
      const employees = await EmployeeService.getAllEmployees()
      res.status(201).json(employees)
    } catch (error: unknown) {
      ErrorsHandlers.handleCustomError(error, res);
    }
  }

  static async getSingleEmployee(req: Request, res: Response): Promise<void> {
    try {
      ensureIdExists(req)
      const result = await EmployeeService.getSingleEmployee(req.params.id)
      if (!result) {
        throw new CustomError("Employee doesn't exist", 404);
      } else {
        res.status(200).json(result);
      }
    } catch (error: unknown) {
      ErrorsHandlers.handleCustomError(error, res);
    }
  }

  static async deleteEmployee(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body.email) {
        throw new CustomError('The email parameter is missing', 400);
      } else {
        const result = await EmployeeService.deleteSingleEmployee(
          req.body.email,
        )
        if (result.deletedCount === 0) {
          throw new CustomError('Employee not found', 404);
        } else {
          res.status(200).json({ message: 'Employee deleted successful' });
        }
      }
    } catch (error) {
      ErrorsHandlers.handleCustomError(error, res);
    }
  }

  static async editEmployee(req: Request, res: Response): Promise<void> {
    try {
      ensureIdExists(req)
      if (!req.body) {
        throw new CustomError('Employee data is missing', 400);
      } else {
        const result = await EmployeeService.editEmployee(
          req.params.id,
          req.body,
        )
        res.status(202).json(result)
      }
    } catch (error: unknown) {
      ErrorsHandlers.handleCustomError(error, res);
    }
  }
}

export default EmployeeController
