import lastOperationModel, { ILastOperation } from "../models/lastOperation.model";

class RequestLoggerService {
    static async saveLogOfLogIn(operation: ILastOperation): Promise<ILastOperation> {
        return lastOperationModel.create(operation)
    }

    static async getAllOperations(): Promise<ILastOperation[]> {
        return lastOperationModel.find()
    }
}

export default RequestLoggerService;