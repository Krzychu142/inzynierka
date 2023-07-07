import { IEmployee } from '../models/employee.model'
import Employee from '../models/employee.model'
import ErrorsHandlers from '../helpers/ErrorsHandlers'
import Crypt from '../helpers/Crypt'
import TokenService from './Token.service'
import { MongoError } from 'mongodb'
import Email from '../utils/email/Email'
import { JwtPayload } from 'jsonwebtoken'

class AuthService {
  static async register(userData: IEmployee): Promise<IEmployee> {
    try {
      userData.password = await Crypt.hashPassword(userData.password)

      userData.tokenForEmailVerification =
        TokenService.generateTokenForEmailVerification(userData.email)

      const user = new Employee(userData)
      await user.save()

      const clietnUrl = process.env.CLIENT_URL || 'http://localhost:3000'

      const emailWithToken = {
        from: 'krzysztofradzieta@outlook.com',
        to: user.email,
        subject: 'Email verification',
        text: `Please click on this link to verify your email: ${clietnUrl}/verifyEmail/${user.tokenForEmailVerification}`,
      }

      const email = Email.getInstance()
      await email.sendEmail(emailWithToken)
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
      const decodedToken = TokenService.verifyTokenForEmailVerification(
        token,
      ) as JwtPayload
      if (!decodedToken.email) {
        throw new Error('Invalid token')
      }
      const user = await Employee.findOne({ email: decodedToken.email })
      if (!user) {
        throw new Error('User not found')
      }
      if (user.isVerified) {
        throw new Error('Email already verified')
      }
      user.isVerified = true
      await user.save()
    } catch (error: unknown) {
      throw new Error(ErrorsHandlers.errorMessageHandler(error).message)
    }
  }
}

export default AuthService
