import { Role } from '../types/role.enum'

interface User {
  _id: string
  email: string
  role: Role
  tokenVersion: number
}

export default User
