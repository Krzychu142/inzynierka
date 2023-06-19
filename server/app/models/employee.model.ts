import { Schema, model } from 'mongoose';

enum Role {
    ADMIN = "admin",
    EMPLOYEE = "employee"
}

interface IEmployee {
    name: string;
    surname: string;
    employedAt: Date;
    email: string;
    password: string;
    role: Role;
    salary: number;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    phoneNumber: string;
    birthDate: Date;
    isAdmin: boolean;
    passwordResetToken: string | null;
    tokenForEmailVerification: string | null;
    refreshToken: string | null;
    tokenVersion: number;
}

export const employeeSchema = new Schema<IEmployee>({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true
    },
    employedAt: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 1024
    },
    role: {
        type: String,
        enum: Object.values(Role),
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    passwordResetToken: {
        type: String,
        default: null
    },
    tokenForEmailVerification: {
        type: String,
        default: null
    },
    refreshToken: {
        type: String,
        default: null
    },
    tokenVersion: {
        type: Number,
        required: true,
        default: 0
    }
});

export default model<IEmployee>('Employee', employeeSchema);