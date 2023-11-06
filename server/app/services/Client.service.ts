import Client, {IClient} from "../models/client.model"

class ClientService {
    static async getAllClients(): Promise<IClient[]> {
        return Client.find()
    }

    static async createClient(client: IClient): Promise<IClient> {
        return Client.create(client)
    }

    static async deleteClient(email: string) {
        return Client.deleteOne({email: email})
    }

    static async getSingleClient(id: string): Promise<IClient | null> {
        return Client.findById(id)
    }

    static async editClient(id: string, editedClient: IClient) {
        return Client.findByIdAndUpdate(id, editedClient, { new: true });
    }
}

export default ClientService