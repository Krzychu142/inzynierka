import { Request, Response } from 'express'
import { IEmployee } from '../models/employee.model'
import AuthService from '../services/Auth.service'
import ErrorsHandlers from '../helpers/ErrorsHandlers'
import Joi from 'joi';

class AuthController {
    private static employeeValidator = Joi.object({
        name: Joi.string().required().min(3).max(255),
        surname: Joi.string().required().min(3).max(255),
        employedAt: Joi.date().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6),
        role: Joi.string().required(),
        salary: Joi.number().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        country: Joi.string().required(),
        postalCode: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        birthDate: Joi.date().required(),
    })

    static async register(req: Request, res: Response): Promise<Response> {
        const userData: IEmployee = req.body
        try {
            await AuthController.employeeValidator.validateAsync(userData)
            const employee = await AuthService.register(userData)
            return res.json(employee)
        } catch (error: unknown) {
            const errorMessages = ErrorsHandlers.errorMessageHandler(error)
            return res.status(400).json({ errorMessages })
        }
    }
}

export default AuthController
