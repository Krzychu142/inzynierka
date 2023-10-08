import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import IJwtUserPayload from '../types/jwtUserPayload.interface';
import ErrorsHandlers from '../utils/helpers/ErrorsHandlers';
import EmployeeService from '../services/Employee.service';
import IRequestWithEmployee from '../types/requestWithUser.interface';


class AuthMiddleware {
    static async checkIsUserLoggedIn(req: IRequestWithEmployee, res: Response, next: NextFunction) {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).send({ error: 'Unauthorized' });
        }

        try {
            if (!process.env.JWT_SECRET_KEY) {
                throw new Error('JWT_SECRET_KEY is not defined')
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as IJwtUserPayload;

            const isEmpolyeeExist = await EmployeeService.getSingleEmployee(decoded.id)


            if (!isEmpolyeeExist) {
                throw new Error("User doesn't exist")
            }

            req.employee = isEmpolyeeExist
            next();
        } catch (e) {
            ErrorsHandlers.errorMessageHandler(e)
        }
    };
}


export default AuthMiddleware