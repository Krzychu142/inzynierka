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

    static async register(req: Request, res: Response): Promise<void> {
        try {
            const userData: IEmployee = req.body
            await AuthController.employeeValidator.validateAsync(userData)
            const employee = await AuthService.register(userData)
            res.status(201).json(employee)
        } catch (error: unknown) {
            res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
        }
    }

    static async verifyEmail(req: Request, res: Response): Promise<void> {
        try {
            const token = req.params.token
            await AuthService.verifyEmail(token)
            res.json({ message: 'Email verified' })
        } catch (error: unknown) {
            res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
        }
    }

    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body
            const token = await AuthService.login(email, password)
            res.status(200).json({ token })
        } catch (error: unknown) {
            res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
        }
    }

    static async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            if (!req.body.email) throw new Error("Email is mising.")
            const { email } = req.body 
            await AuthService.forgotPassword(email)
            res.status(201).json({ message: 'Email sent' })
        } catch (error: unknown) {
            res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
        }
    }

    static async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            if (!req.body.token || !req.body.password) throw new Error("Missing arguments.")
            const { token, password } = req.body
            const decodedToken = Buffer.from(token, 'base64').toString('utf8');
            await AuthService.resetPassword(decodedToken, password)
            res.status(201).json({ message: 'Password changed' })
        } catch (error: unknown) {
            res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
        }
    }
}

export default AuthController
