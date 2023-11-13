import mongoose from "mongoose"
import Client from "../models/client.model"
import { IClient } from "../types/client.interface"

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

    static async getClientByEmail(email: string): Promise<IClient | null> {
        return Client.findOne({ email: email });
    }

    static async incrementOrderCount(clientId: mongoose.Types.ObjectId, session?: mongoose.ClientSession): Promise<void> {
        const updatedClient = await Client.findOneAndUpdate(
            { _id: clientId },
            { $inc: { countOfOrder: 1 } },
            { new: true, session: session } 
        );

        if (updatedClient && updatedClient.countOfOrder > 5) {
            updatedClient.regular = true;
            await updatedClient.save({ session: session });
        }
    }

}

export default ClientService