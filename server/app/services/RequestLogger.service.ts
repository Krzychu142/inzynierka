import lastOperationModel from "../models/lastOperation.model";
import { ILastOperation } from "../types/lastOperation.interface";

class RequestLoggerService {
    static async saveLog(operation: ILastOperation): Promise<ILastOperation> {
        return lastOperationModel.create(operation);
    }

    static async getAllOperations(): Promise<ILastOperation[]> {
        return lastOperationModel.find()
    }
}

export default RequestLoggerService;