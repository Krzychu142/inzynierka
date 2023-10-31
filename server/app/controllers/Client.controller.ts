import { Request, Response } from 'express'
import { IClient } from '../models/client.model'

class ClientController {
    static async getAllClients(req: Request, res: Response) {
        console.log("here")
    }
}

export default ClientController;