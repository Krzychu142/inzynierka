import { IEmployee } from '../models/employee.model'
import Employee from '../models/employee.model'
import ErrorsHandlers from '../helpers/ErrorsHandlers'
import Crypt from '../helpers/Crypt'
import TokenService from './Token.service'

class AuthService {

    static async register(userData: IEmployee): Promise<IEmployee> {
        try {
            userData.password = await Crypt.hashPassword(userData.password)

            userData.tokenForEmailVerification = TokenService.generateTokenForEmailVerification(userData.email)

            // there I end 

            const user = new Employee(userData)
            const newUser = await user.save()
            return newUser
        } catch (error: unknown) {
            throw new Error(ErrorsHandlers.errorMessageHandler(error).message)
        }
    }
}

export default AuthService
