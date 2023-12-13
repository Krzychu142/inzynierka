import { MongoError } from 'mongodb'
import CustomError from './CustomError'
import { Response } from 'express'

class ErrorsHandlers {
  static errorMessageHandler(error: unknown): { message: string } {
    if (error instanceof Error) {
      return { message: error.message }
    }
    return { message: 'Something went wrong' }
  }

  static handleMongoError(error: unknown): never {
    if (error instanceof MongoError && error.code === 11000) {
      throw new Error('Duplicate key error')
    } else {
      throw new Error(ErrorsHandlers.errorMessageHandler(error).message)
    }
  }

  static handleCustomError(error: unknown, res: Response): void {
    if (error instanceof MongoError && error.code === 11000) {
      res.status(409).json({
        message: "Duplicate key error.",
        details: error.message,
      });
    } else if (error instanceof CustomError) {
      res
        .status(error.getStatusCode())
        .json(ErrorsHandlers.errorMessageHandler(error));
    } else {
      res.status(500).json(ErrorsHandlers.errorMessageHandler(error));
    }
  }
}

export default ErrorsHandlers
