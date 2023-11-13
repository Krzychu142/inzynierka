import { Document } from "mongoose"

export interface IProduct extends Document {
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
  addedAt?: Date
  soldAt?: Date
}