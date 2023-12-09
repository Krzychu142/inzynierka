import RequestLoggerService from '../services/RequestLogger.service'
import { Request, Response } from 'express'
import ErrorsHandlers from '../utils/helpers/ErrorsHandlers'

class RequestLoggerController {
  static async getAllOperations(req: Request, res: Response): Promise<void> {
    try {
      res.status(201).json(await RequestLoggerService.getAllOperations())
    } catch (error) {
      ErrorsHandlers.handleCustomError(error, res)
    }
  }
}

export default RequestLoggerController
