import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import IJwtEmployeePayload from '../types/jwtEmployeePayload.interface';
import ErrorsHandlers from '../utils/helpers/ErrorsHandlers';
import EmployeeService from '../services/Employee.service';
import IRequestWithEmployee from '../types/requestWithEmployee.interface';
import RolesArray from '../types/rolesArray.type'

class AuthMiddleware {
    static async checkIsEmployeeLoggedIn(req: IRequestWithEmployee, res: Response, next: NextFunction) {
        try {        
            const token = req.header('Authorization')?.replace('Bearer ', '');

            if (!token) {
                throw new Error('Unauthorized');
            }

            if (!process.env.JWT_SECRET_KEY) {
                throw new Error('JWT_SECRET_KEY is not defined')
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as IJwtEmployeePayload;
            const isEmpolyeeExist = await EmployeeService.getSingleEmployee(decoded.id)

            if (!isEmpolyeeExist) {
                throw new Error("Employee doesn't exist")
            }

            req.employee = isEmpolyeeExist
            next();
        } catch (e: unknown) {
            res.status(500).json(ErrorsHandlers.errorMessageHandler(e))
        }
    };

    static checkIsEmployeeHaveCorrectPermission(rolesWithAccess: RolesArray) {
        return async (req: IRequestWithEmployee, res: Response, next: NextFunction) => {
            try {
                if (!req.employee){
                    throw new Error("Employee doesn't provided")
                }
                
                if (rolesWithAccess.includes(req.employee.role)) {
                    next();
                } else {
                    throw new Error("You don't have permission to do this")
                }
                
            } catch (e: unknown) {
                res.status(500).json(ErrorsHandlers.errorMessageHandler(e))
            }
        }
    }
}


export default AuthMiddleware