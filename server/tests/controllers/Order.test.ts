import OrderController from '../../app/controllers/Order.controller'
import OrderService from '../../app/services/Order.service'
import ErrorsHandlers from '../../app/utils/helpers/ErrorsHandlers'
import CustomError from '../../app/utils/helpers/CustomError'
import { Request, Response } from 'express'

jest.mock('../../app/services/Order.service')
jest.mock('../../app/utils/helpers/ErrorsHandlers')

describe('OrderController.deleteOrder', () => {
  describe('given no orderId in the request', () => {
    it('should throw an error indicating the orderId is missing', async () => {
      const req = { body: {} } as unknown as Request
      const res = {} as Response
      res.status = jest.fn().mockReturnThis()
      res.json = jest.fn()

      await OrderController.deleteOrder(req, res)

      const expectedError = new CustomError('Order id is missing.', 400)
      expect(ErrorsHandlers.handleCustomError).toHaveBeenCalledWith(
        expectedError,
        res,
      )
    })
  })

  describe('given an orderId that does not correspond to any existing order', () => {
    it('should throw an error indicating the order was not found', async () => {
      const req = { body: { orderId: 'non-existing-id' } } as unknown as Request
      const res = {} as Response
      res.status = jest.fn().mockReturnThis()
      res.json = jest.fn()

      OrderService.deleteOrder = jest.fn().mockResolvedValue(false)

      await OrderController.deleteOrder(req, res)

      const expectedError = new CustomError('Order not found', 404)
      expect(ErrorsHandlers.handleCustomError).toHaveBeenCalledWith(
        expectedError,
        res,
      )
    })
  })
})
