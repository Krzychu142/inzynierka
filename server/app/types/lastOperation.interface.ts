import { Operation } from "./operation.enum";

export interface ILastOperation {
    nameOfOperation: Operation,
    dateExecution: Date,
    operationPerformedBy: string
}