import { Role } from '../types/role.enum'
import { ObjectId } from 'mongodb'

interface IUser {
  _id: ObjectId
  email: string
  role: Role
}

export default IUser
