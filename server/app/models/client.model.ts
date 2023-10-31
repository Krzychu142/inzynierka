import { Schema, model } from 'mongoose'
import {Priority} from "../types/priority.enum"

export interface IClient {
    name: string
    surname: string
    addedAt: Date
    email: string
    salary: number
    address: string
    city: string
    country: string
    postalCode: string
    phoneNumber: string
    description: string | null
    priority: Priority,
    // it will be true if user create more than 5 orders for example
    regular: boolean
}

export const clientSchema = new Schema<IClient>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    surname: {
        type: String,
        required: true,
        trim: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    salary: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    postalCode: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: null
    },
    priority: {
        type: String,
        enum: Object.values(Priority),
        required: true
    },
    regular: {
        type: Boolean,
        default: false
    }
});

export default model<IClient>('Client', clientSchema);