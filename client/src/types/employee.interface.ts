export enum Role {
  CARTOPERATOR = 'cart operator',
  WAREHOUSEMAN = 'warehouseman',
  SALESMAN = 'salesman',
  MANAGER = 'manager',
}

export interface IEmployee {
  name: string
  surname: string
  employedAt: Date
  email: string
  password: string
  role: Role
  salary: number
  address: string
  city: string
  country: string
  postalCode: string
  phoneNumber: string
  birthDate: Date
  passwordResetToken: string | null
  tokenForEmailVerification: string | null
  isVerified: boolean,
  _id: string
}