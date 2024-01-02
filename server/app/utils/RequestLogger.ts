import { Response, NextFunction } from 'express'
import { Operation } from '../types/operation.enum'
import RequestLoggerService from '../services/RequestLogger.service'
import ErrorsHandlers from './helpers/ErrorsHandlers'
import IRequestWithClientEmail from '../types/requestWithClientEmail.interface'

// that is instead of interceptor
class RequestLogger {
  private static logOperation(req: IRequestWithClientEmail, operation: Operation): void {
    try {
      RequestLoggerService.saveLog({
        nameOfOperation: operation,
        dateExecution: new Date(),
        operationPerformedBy: req.body.email || req.body.clientEmail || req.clientEmail,
      })
    } catch (error) {
      console.log(ErrorsHandlers.errorMessageHandler(error))
    }
  }

  static logRequest(req: IRequestWithClientEmail, res: Response, next: NextFunction) {
    res.on('finish', () => {
      if (req.path === '/login' && req.body.email && res.statusCode === 200) {
        RequestLogger.logOperation(req, Operation.LOGGING)
      }

      if (
        req.originalUrl === '/clients/create' &&
        req.body.email &&
        res.statusCode === 201
      ) {
        RequestLogger.logOperation(req, Operation.NEWCLIENT)
      }

      if (
        req.originalUrl === '/orders/create' &&
        req.clientEmail &&
        res.statusCode === 201
      ) {
        RequestLogger.logOperation(req, Operation.NEWORDER)
      }
    })

    next()
  }
}

export default RequestLogger
