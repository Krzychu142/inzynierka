export enum Priority { 
    VIP = "vip",
    IMPORTANT = "important",
    NORMAL = "normal",
    LOWPRIORITY = "low priority"
}

export interface IClient {
    _id: string
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
    regular: boolean, 
    countOfOrder: number
}