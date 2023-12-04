import lastOperationModel from "../models/lastOperation.model";
import { ILastOperation } from "../types/lastOperation.interface";

class RequestLoggerService {
    private static logCount = 0;
    private static maxLogCount = 100;

    static async saveLog(operation: ILastOperation): Promise<ILastOperation> {
        const newLog = await lastOperationModel.create(operation);
        RequestLoggerService.logCount++;
        await RequestLoggerService.removeOldestLogsIfNecessary();
        return newLog;
    }

    static async getAllOperations(): Promise<ILastOperation[]> {
        return lastOperationModel.find();
    }

    private static async removeOldestLogsIfNecessary(): Promise<void> {
        if (RequestLoggerService.logCount > RequestLoggerService.maxLogCount) {
            const logsToDelete = await lastOperationModel.find().sort({ dateExecution: 1 }).limit(RequestLoggerService.logCount - RequestLoggerService.maxLogCount);
            for (const log of logsToDelete) {
                await lastOperationModel.findByIdAndDelete(log._id);
            }

            RequestLoggerService.logCount = RequestLoggerService.maxLogCount;
        }
    }

    static async initializeLogCount(): Promise<void> {
        RequestLoggerService.logCount = await lastOperationModel.countDocuments();
    }
}

export default RequestLoggerService;