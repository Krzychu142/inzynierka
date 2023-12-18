import AuthMiddleware from '../../../app/middleware/Auth.middleware'
import { Role } from '../../../app/types/role.enum'
import { Request, Response, NextFunction } from 'express'
import CustomError from '../../../app/utils/helpers/CustomError'
import ErrorsHandlers from '../../../app/utils/helpers/ErrorsHandlers'

jest.mock('../../../app/utils/helpers/ErrorsHandlers')

describe('checkIsEmployeeHaveCorrectPermission', () => {
  const mockResponse = () => {
    const res = {} as Response
    res.status = jest.fn().mockReturnThis()
    res.json = jest.fn().mockReturnThis()
    return res
  }

  const nextFunction: NextFunction = jest.fn()

  it('should throw an error if employee is not provided', async () => {
    const req = { employee: undefined } as unknown as Request
    const res = mockResponse()

    await AuthMiddleware.checkIsEmployeeHaveCorrectPermission([Role.MANAGER])(
      req,
      res,
      nextFunction,
    )

    expect(ErrorsHandlers.handleCustomError).toHaveBeenCalledWith(
      expect.any(CustomError),
      res,
    )
  })

  it('should throw an error if employee role does not have permission', async () => {
    const req = { employee: { role: Role.CARTOPERATOR } } as unknown as Request
    const res = mockResponse()

    await AuthMiddleware.checkIsEmployeeHaveCorrectPermission([Role.MANAGER])(
      req,
      res,
      nextFunction,
    )

    expect(ErrorsHandlers.handleCustomError).toHaveBeenCalledWith(
      expect.any(CustomError),
      res,
    )
  })

  it('should call next if employee role has permission', async () => {
    const req = { employee: { role: Role.MANAGER } } as unknown as Request
    const res = mockResponse()

    await AuthMiddleware.checkIsEmployeeHaveCorrectPermission([Role.MANAGER])(
      req,
      res,
      nextFunction,
    )

    expect(nextFunction).toHaveBeenCalled()
  })
})
