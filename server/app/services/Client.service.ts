import Client, {IClient} from "../models/client.model"

class ClientService {
    static async getAllClients(): Promise<IClient[]> {
        return Client.find()
    }
}

export default ClientService