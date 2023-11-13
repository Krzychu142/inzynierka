import { Schema, model } from 'mongoose'
import { IProduct } from '../types/product.interface'

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
    default: Date.now,
  },
  soldAt: {
    type: Date,
    default: null,
  },
  currency: {
    type: String,
    default: "PLN"
  }
})

export default model<IProduct>('Product', productSchema)
