import { Document } from "mongoose"
import { Priority } from "./priority.enum"


export interface IClient extends Document {
    name: string
    surname: string
    addedAt: Date
    email: string
    address: string
    shippingAddress?: string | null
    city: string
    country: string
    postalCode: string
    phoneNumber: string
    description?: string | null
    priority: Priority,
    // it will be true if user create more than 5 orders for example
    regular: boolean,
    countOfOrder: number
}