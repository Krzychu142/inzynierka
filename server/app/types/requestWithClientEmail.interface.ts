import { Request } from 'express'

interface IRequestWithClientEmail extends Request {
  clientEmail?: string
}

export default IRequestWithClientEmail
