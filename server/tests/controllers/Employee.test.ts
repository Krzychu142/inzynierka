import EmployeeController from '../../app/controllers/Employee.controller'
import EmployeeService from '../../app/services/Employee.service'
import CustomError from '../../app/utils/helpers/CustomError'
import ErrorsHandlers from '../../app/utils/helpers/ErrorsHandlers'
import { Request, Response } from 'express'

jest.mock('../../app/services/Employee.service')
jest.mock('../../app/utils/helpers/ErrorsHandlers')

describe('EmployeeController.deleteEmployee', () => {
  describe('given no email parameter in the request', () => {
    it('should throw an error if the email parameter is missing', async () => {
      const req = {
        body: {},
      } as unknown as Request
      const res = {} as Response
      res.status = jest.fn().mockReturnThis()
      res.json = jest.fn()

      await EmployeeController.deleteEmployee(req, res)
      const expectedError = new CustomError(
        'The email parameter is missing',
        400,
      )
      expect(ErrorsHandlers.handleCustomError).toHaveBeenCalledWith(
        expectedError,
        res,
      )
    })
  })

  describe('given an email that does not correspond to any employee in the database', () => {
    it('should throw an error if the employee is not found', async () => {
      const req = {
        body: { email: 'test@example.com' },
      } as unknown as Request
      const res = {} as Response
      res.status = jest.fn().mockReturnThis()
      res.json = jest.fn()

      EmployeeService.deleteSingleEmployee = jest
        .fn()
        .mockResolvedValue({ deletedCount: 0 })

      await EmployeeController.deleteEmployee(req, res)

      expect(EmployeeService.deleteSingleEmployee).toHaveBeenCalledWith(
        'test@example.com',
      )
      const expectedError = new CustomError('Employee not found', 404)
      expect(ErrorsHandlers.handleCustomError).toHaveBeenCalledWith(
        expectedError,
        res,
      )
    })
  })
})
