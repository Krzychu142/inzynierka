export enum Operation {
  LOGGING = "Logged in",
  NEWCLIENT = "Added new client",
  NEWORDER = "A new order has been placed",
}

export interface ILastOperation {
  _id: string;
  nameOfOperation: Operation;
  dateExecution: Date;
  operationPerformedBy: string;
}