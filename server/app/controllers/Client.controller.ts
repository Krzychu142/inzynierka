import { Request, Response } from 'express'
import ClientService from '../services/Client.service'
import ErrorsHandlers from '../utils/helpers/ErrorsHandlers'
import ensureIdExists from '../utils/helpers/ensureIdExists'
import OrderService from '../services/Order.service'
import CustomError from '../utils/helpers/CustomError'

class ClientController {
  static async getAllClients(req: Request, res: Response): Promise<void> {
    try {
      const result = await ClientService.getAllClients()
      if (result) {
        res.status(201).json(result)
      } else {
        throw new CustomError('Clients not found', 404)
      }
    } catch (error: unknown) {
      ErrorsHandlers.handleCustomError(error, res)
    }
  }

  static async createClient(req: Request, res: Response): Promise<void> {
    try {
      const result = await ClientService.createClient(req.body)
      if (result) {
        res.status(201).json({ message: 'New client added' })
      } else {
        throw new CustomError('The client was not created', 400)
      }
    } catch (error: unknown) {
      ErrorsHandlers.handleCustomError(error, res)
    }
  }

  static async deleteClient(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body.clientId) {
        throw new CustomError('Client id is missing', 400)
      }

      const deletedOrdersCount = await OrderService.deleteOrdersByClientId(
        req.body.clientId,
      )

      const result = await ClientService.deleteClient(req.body.clientId)
      if (result.deletedCount === 0) {
        throw new CustomError('Client not found', 404)
      } else {
        res.status(201).json({
          message: `Client and ${deletedOrdersCount} orders deleted successful`,
        })
      }
    } catch (error: unknown) {
      ErrorsHandlers.handleCustomError(error, res)
    }
  }

  static async getSingleClient(req: Request, res: Response): Promise<void> {
    try {
      ensureIdExists(req)
      const result = await ClientService.getSingleClient(req.params.id)
      if (!result) {
        throw new CustomError("Client doesn't exist", 404)
      } else {
        res.status(200).json(result)
      }
    } catch (error: unknown) {
      ErrorsHandlers.handleCustomError(error, res)
    }
  }

  static async editClient(req: Request, res: Response): Promise<void> {
    try {
      ensureIdExists(req)
      if (!req.body) {
        throw new CustomError('Client data is missing', 400)
      } else {
        const result = await ClientService.editClient(req.params.id, req.body)
        res.status(202).json(result)
      }
    } catch (error: unknown) {
      ErrorsHandlers.handleCustomError(error, res)
    }
  }
}

export default ClientController
