import { Request } from 'express'
import CustomError from './CustomError'

export default function ensureIdExists(req: Request): void {
  if (!req.params.id || req.params.id === ':id') {
    throw new CustomError('The id parameter is missing', 400)
  }
}
