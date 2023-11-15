import { Document, Schema, model } from 'mongoose'
import { Role } from '../types/role.enum'
import { ContractType } from '../types/contractType.enum'

export interface IEmployee extends Document {
  name: string
  surname: string
  employedAt: Date
  email: string
  password: string
  role: Role
  salary: number
  currency?: string
  contractType: ContractType
  address: string
  city: string
  country: string
  postalCode: string
  phoneNumber: string
  birthDate: Date
  passwordResetToken: string | null
  // tokenForEmailVerification: string | null
  // isVerified: boolean
}

export const employeeSchema = new Schema<IEmployee>({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  employedAt: {
    type: Date,
    default: Date.now
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  role: {
    type: String,
    enum: Object.values(Role),
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  contractType: {
    type: String,
    enum: Object.values(ContractType),
    required: true
  },
  currency: {
    type: String,
    default: "PLN"
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  phoneNumber: {
    // it's string because a phone number can have a prefix e.x. +48 
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  passwordResetToken: {
    type: String,
    default: null,
  },
  // tokenForEmailVerification: {
  //   type: String,
  //   default: null,
  // },
  // isVerified: {
  //   type: Boolean,
  //   default: false,
  // }
})

export default model<IEmployee>('Employee', employeeSchema)
