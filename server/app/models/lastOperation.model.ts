import { Schema, model } from 'mongoose'
import { Operation } from '../types/operation.enum'
import { ILastOperation } from '../types/lastOperation.interface'

export const lastOperationSchema = new Schema<ILastOperation>({
  nameOfOperation: {
    type: String,
    enum: Object.values(Operation),
    required: true,
  },
  dateExecution: {
    type: Date,
    required: true,
    default: Date.now,
  },
  operationPerformedBy: {
    type: String,
    required: true,
  },
})

export default model<ILastOperation>('LastOperation', lastOperationSchema)
