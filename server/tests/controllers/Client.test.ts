import ClientController from '../../app/controllers/Client.controller'
import ClientService from '../../app/services/Client.service'
import CustomError from '../../app/utils/helpers/CustomError'
import ErrorsHandlers from '../../app/utils/helpers/ErrorsHandlers'
import { Request, Response } from 'express'

jest.mock('../../app/services/Client.service')
jest.mock('../../app/utils/helpers/ErrorsHandlers')

describe('ClientController.getSingleClient', () => {
  const mockClient = { id: '123', name: 'Test Client' }

  describe('given no id parameter in the request or an invalid id', () => {
    it('should throw an error', async () => {
      const req = { params: { id: ':id' } } as unknown as Request
      const res = {} as Response
      res.status = jest.fn().mockReturnThis()
      res.json = jest.fn()

      await ClientController.getSingleClient(req, res)

      const expectedError = new CustomError('The id parameter is missing', 400)
      expect(ErrorsHandlers.handleCustomError).toHaveBeenCalledWith(
        expectedError,
        res,
      )
    })
  })

  describe('given a valid id corresponding to an existing client', () => {
    it('should return the client', async () => {
      ClientService.getSingleClient = jest.fn().mockResolvedValue(mockClient)
      const req = { params: { id: '123' } } as unknown as Request
      const res = {} as Response
      res.status = jest.fn().mockReturnThis()
      res.json = jest.fn()

      await ClientController.getSingleClient(req, res)

      expect(ClientService.getSingleClient).toHaveBeenCalledWith('123')
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockClient)
    })
  })
})
