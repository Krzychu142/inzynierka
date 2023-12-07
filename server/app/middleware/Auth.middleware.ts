import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import IJwtEmployeePayload from '../types/jwtEmployeePayload.interface'
import ErrorsHandlers from '../utils/helpers/ErrorsHandlers'
import EmployeeService from '../services/Employee.service'
import IRequestWithEmployee from '../types/requestWithEmployee.interface'
import RolesArray from '../types/rolesArray.type'
import CustomError from '../utils/helpers/CustomError'

class AuthMiddleware {
  static async checkIsEmployeeLoggedIn(
    req: IRequestWithEmployee,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '')

      if (!token) {
        throw new CustomError('Unauthorized', 403)
      }

      if (!process.env.JWT_SECRET_KEY) {
        throw new CustomError('JWT_SECRET_KEY is not defined')
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY,
      ) as IJwtEmployeePayload
      const isEmpolyeeExist = await EmployeeService.getSingleEmployee(
        decoded.id,
      )

      if (!isEmpolyeeExist) {
        throw new CustomError("Employee doesn't exist", 404)
      }

      req.employee = isEmpolyeeExist
      next()
    } catch (e: unknown) {
      ErrorsHandlers.handleCustomError(e, res)
    }
  }

  static checkIsEmployeeHaveCorrectPermission(rolesWithAccess: RolesArray) {
    return async (
      req: IRequestWithEmployee,
      res: Response,
      next: NextFunction,
    ) => {
      try {
        if (!req.employee) {
          throw new CustomError("Employee doesn't provided", 401)
        }

        if (rolesWithAccess.includes(req.employee.role)) {
          next()
        } else {
          throw new CustomError("You don't have permission to do this", 403)
        }
      } catch (e: unknown) {
        ErrorsHandlers.handleCustomError(e, res)
      }
    }
  }
}

export default AuthMiddleware
