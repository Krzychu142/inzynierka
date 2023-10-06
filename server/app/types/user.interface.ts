import { Role } from '../types/role.enum'
import { ObjectId } from 'mongodb'

interface User {
  _id: ObjectId
  email: string
  role: Role
}

export default User
