import { Role } from './role.enum'
import { ObjectId } from 'mongodb'

interface IEmployee {
  _id: ObjectId
  email: string
  role: Role,
  name: string
}

export default IEmployee
