import { Schema, model } from 'mongoose'

export interface IProduct {
  sku: string
  name: string
  description: string
  stockQuantity: number
  price: number
  promotionalPrice?: number
  isOnSale: boolean
  isAvailable: boolean
  images: string[]
  initialStockQuantity: number
  addedAt: Date
  soldAt?: Date
}

export const productSchema = new Schema<IProduct>({
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  stockQuantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  promotionalPrice: {
    type: Number,
    default: null,
  },
  isOnSale: {
    type: Boolean,
    default: false,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  images: {
    type: [String],
    default: [],
  },
  initialStockQuantity: {
    type: Number,
    required: true,
  },
  addedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  soldAt: {
    type: Date,
    default: null,
  },
})

export default model<IProduct>('Product', productSchema)
