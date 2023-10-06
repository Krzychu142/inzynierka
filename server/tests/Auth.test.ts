import { Request, Response } from 'express'
import AuthController from '../app/controllers/Auth.controller'
import AuthService from '../app/services/Auth.service'
import Crypt from '../app/utils/helpers/Crypt'
import TokenService from '../app/services/Token.service'
import Employee from '../app/models/employee.model'
import ErrorsHandlers from '../app/utils/helpers/ErrorsHandlers'

jest.mock('../app/services/Auth.service')
jest.mock('../app/helpers/Crypt')
jest.mock('../app/services/Token.service')
jest.mock('../app/models/Employee.model')
jest.mock('../app/helpers/ErrorsHandlers')

describe('AuthController', () => {
  describe('register', () => {
    it('should successfully register user', async () => {
      const mockUser = {
        name: 'John',
        surname: 'Doe',
        employedAt: '2023-07-07',
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'user',
        salary: 1000,
        address: '123 Main St',
        city: 'New York',
        country: 'USA',
        postalCode: '12345',
        phoneNumber: '123456789',
        birthDate: '1990-01-01',
      }

      const req = {
        body: mockUser,
      } as unknown as Request

      const res = {
        json: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response

        ; (Crypt.hashPassword as jest.Mock).mockResolvedValue('hashedPassword')
        ; (
          TokenService.generateTokenForEmailVerificationOrPasswordReset as jest.Mock
        ).mockReturnValue('token')
        ; (Employee.prototype.save as jest.Mock).mockResolvedValue(mockUser)

      await AuthController.register(req, res)

      expect(res.json).toHaveBeenCalled()
      expect(res.status).not.toHaveBeenCalledWith(400)
    })

    it('should return error if validation or registration fails', async () => {
      const mockUser = {
        // Missing required fields
        name: 'John',
        surname: 'Doe',
      }

      const req = {
        body: mockUser,
      } as unknown as Request

      const res = {
        json: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response

        ; (AuthService.register as jest.Mock).mockRejectedValue(
          new Error('Validation failed'),
        )
        ; (ErrorsHandlers.errorMessageHandler as jest.Mock).mockReturnValue({
          message: 'Validation failed',
        })

      await AuthController.register(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalled()
    })
  })
})
