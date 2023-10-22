import { IEmployee } from '../models/employee.model'
import Employee from '../models/employee.model'
import ErrorsHandlers from '../utils/helpers/ErrorsHandlers'
import Crypt from '../utils/helpers/Crypt'
import TokenService from './Token.service'
import { MongoError } from 'mongodb'
import Email from '../utils/email/Email'
import { JwtPayload } from 'jsonwebtoken'

class AuthService {

    private static clientUrl = process.env.CLIENT_URL || 'http://localhost:3000'

    private static emailAdress = process.env.EMAIL_ADRESS || 'krzysztofradzieta@outlook.com'

    static async register(userData: IEmployee): Promise<IEmployee | string> {
        try {
            userData.password = await Crypt.hashPassword(userData.password)

            userData.passwordResetToken =
                TokenService.generateTokenForEmailVerificationOrPasswordReset(userData.email)

            const user = new Employee(userData)
            await user.save()

            const emailSender = Email.getInstance()
            const emailOptions = emailSender.emailOptions(this.emailAdress, user.email, `Welcome ${user.name}`, `Please click on this link to set Your new password: ${this.clientUrl}/resetPassword/${user.passwordResetToken} The link will be valid for 24 hours.`)
            await emailSender.sendEmail(emailOptions)

            return user
        } catch (error: unknown) {
            if (error instanceof MongoError && error.code === 11000) {
                throw new Error('Email already exists')
            } else {
                throw new Error(ErrorsHandlers.errorMessageHandler(error).message)
            }
        }
    }

    static async verifyEmail(token: string): Promise<void> {
        try {
            const decodedToken = TokenService.verifyTokenForEmailVerificationOrPasswordReset(
                token,
            ) as JwtPayload
            if (!decodedToken.email) {
                throw new Error('Invalid token')
            }
            const user = await Employee.findOne({ email: decodedToken.email })
            if (!user) {
                throw new Error('User not found')
            }
            // if (user.isVerified) {
            //     throw new Error('Email already verified')
            // }
            // user.isVerified = true
            // user.tokenForEmailVerification = null
            await user.save()
        } catch (error: unknown) {
            throw new Error(ErrorsHandlers.errorMessageHandler(error).message)
        }
    }

    static async login(email: string, password: string): Promise<string> {
        try {
            const user = await Employee.findOne({ email })

            if (!user) {
                throw new Error('Invalid email or password')
            }

            const isPasswordCorrect = await Crypt.comparePassword(
                password,
                user.password,
            )

            if (!isPasswordCorrect) {
                throw new Error('Invalid email or password')
            }

            const token = TokenService.generateToken(user)

            return token
        } catch (error: unknown) {
            throw new Error(ErrorsHandlers.errorMessageHandler(error).message)
        }
    }

    static async forgotPassword(email: string): Promise<void> {
        try {
            const user = await Employee.findOne({ email })

            if (!user) { throw new Error('Invalid email') }

            user.passwordResetToken = TokenService.generateTokenForEmailVerificationOrPasswordReset(
                user.email,
            )
            await user.save()

            const emailSender = Email.getInstance()
            const emailOptions = emailSender.emailOptions(this.emailAdress, user.email, "Reset password", `Please click on this link to reset your password: ${this.clientUrl}/resetPassword/${user.passwordResetToken}`)
            await emailSender.sendEmail(emailOptions)

        } catch (error: unknown) {
            throw new Error(ErrorsHandlers.errorMessageHandler(error).message)
        }
    }

    static async resetPassword(token: string, password: string): Promise<void> {
        try {
            const decodedToken = TokenService.verifyTokenForEmailVerificationOrPasswordReset(
                token,
            ) as JwtPayload
            if (!decodedToken.email) {
                throw new Error('Invalid token')
            }
            const user = await Employee.findOne({ email: decodedToken.email })
            if (!user) {
                throw new Error('User not found')
            }
            if (user.passwordResetToken !== token) {
                throw new Error('Invalid token')
            }
            user.password = await Crypt.hashPassword(password)
            user.passwordResetToken = null
            await user.save()
        } catch (error: unknown) {
            throw new Error(ErrorsHandlers.errorMessageHandler(error).message)
        }
    }
}

export default AuthService
