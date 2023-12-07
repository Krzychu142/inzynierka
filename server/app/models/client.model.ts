import { Schema, model } from 'mongoose'
import { Priority } from '../types/priority.enum'
import { IClient } from '../types/client.interface'

export const clientSchema = new Schema<IClient>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  surname: {
    type: String,
    required: true,
    trim: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  shippingAddress: {
    type: String,
    trim: true,
    default: null,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  postalCode: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: null,
  },
  priority: {
    type: String,
    enum: Object.values(Priority),
    default: Priority.NORMAL,
  },
  regular: {
    type: Boolean,
    default: false,
  },
  countOfOrder: {
    type: Number,
    default: 0,
  },
})

// let shippingAddress be same as an address by default
clientSchema.virtual('effectiveShippingAddress').get(function (this: IClient) {
  return this.shippingAddress || this.address
})

export default model<IClient>('Client', clientSchema)
