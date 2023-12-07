import { Request, Response } from 'express'
import ClientService from '../services/Client.service'
import ErrorsHandlers from '../utils/helpers/ErrorsHandlers'
import ensureIdExists from '../utils/helpers/ensureIdExists'
import OrderService from '../services/Order.service'

class ClientController {
  static async getAllClients(req: Request, res: Response): Promise<void> {
    try {
      const result = await ClientService.getAllClients()
      if (result) {
        res.status(201).json(result)
      } else {
        throw new Error('Clients not found')
      }
    } catch (error: unknown) {
      res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
    }
  }

  static async createClient(req: Request, res: Response): Promise<void> {
    try {
      const result = await ClientService.createClient(req.body)
      if (result) {
        res.status(201).json({ message: 'New client added' })
      } else {
        throw Error('The client was not created')
      }
    } catch (error: unknown) {
      res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
    }
  }

  static async deleteClient(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body.clientId) {
        throw new Error('Client id is missing')
      }

      const deletedOrdersCount = await OrderService.deleteOrdersByClientId(
        req.body.clientId,
      )

      const result = await ClientService.deleteClient(req.body.clientId)
      if (result.deletedCount === 0) {
        res.status(404).json({ message: 'Client not found' })
      } else {
        res.status(201).json({
          message: `Client and ${deletedOrdersCount} orders deleted successful`,
        })
      }
    } catch (error: unknown) {
      res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
    }
  }

  static async getSingleClient(req: Request, res: Response): Promise<void> {
    try {
      ensureIdExists(req)
      const result = await ClientService.getSingleClient(req.params.id)
      if (!result) {
        res.status(404).json({ message: "Client doesn't exist" })
      } else {
        res.status(200).json(result)
      }
    } catch (error: unknown) {
      res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
    }
  }

  static async editClient(req: Request, res: Response): Promise<void> {
    try {
      ensureIdExists(req)
      if (!req.body) {
        res.status(400).json({ message: 'Client data is missing' })
      } else {
        const result = await ClientService.editClient(req.params.id, req.body)
        res.status(202).json(result)
      }
    } catch (error: unknown) {
      res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
    }
  }
}

export default ClientController
