import Client, {IClient} from "../models/client.model"

class ClientService {
    static async getAllClients(): Promise<IClient[]> {
        return Client.find()
    }

    static async createClient(client: IClient): Promise<IClient> {
        return Client.create(client)
    }
}

export default ClientService