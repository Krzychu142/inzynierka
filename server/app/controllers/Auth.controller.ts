import { Request, Response } from 'express'
import { IEmployee } from '../models/employee.model'
import AuthService from '../services/Auth.service'
import ErrorsHandlers from '../utils/helpers/ErrorsHandlers'
import Joi from 'joi'

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

    private static handleError(error: unknown, res: Response): Response {
        const errorMessages = ErrorsHandlers.errorMessageHandler(error);
        return res.status(400).json(errorMessages);
    }

    static async register(req: Request, res: Response): Promise<Response> {
        const userData: IEmployee = req.body
        try {
            await AuthController.employeeValidator.validateAsync(userData)
            const employee = await AuthService.register(userData)
            return res.json(employee)
        } catch (error: unknown) {
            return this.handleError(error, res);
        }
    }

    static async verifyEmail(req: Request, res: Response): Promise<Response> {
        const token = req.params.token
        try {
            await AuthService.verifyEmail(token)
            return res.json({ message: 'Email verified' })
        } catch (error: unknown) {
            return this.handleError(error, res);
        }
    }

    static async login(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body
        try {
            const token = await AuthService.login(email, password)
            return res.json({ token })
        } catch (error: unknown) {
            return this.handleError(error, res);
        }
    }

    static async forgotPassword(req: Request, res: Response): Promise<Response> {
        const { email } = req.body
        try {
            await AuthService.forgotPassword(email)
            return res.json({ message: 'Email sent' })
        } catch (error: unknown) {
            return this.handleError(error, res);
        }
    }

    static async resetPassword(req: Request, res: Response): Promise<Response> {
        const { token } = req.params
        const { password } = req.body
        try {
            await AuthService.resetPassword(token, password)
            return res.json({ message: 'Password changed' })
        } catch (error: unknown) {
            return this.handleError(error, res);
        }
    }
}

export default AuthController
