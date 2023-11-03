import { Role } from './role.enum'
import { ObjectId } from 'mongodb'

// to generate tokens 
interface IEmployee {
  _id: ObjectId
  email: string
  role: Role,
  name: string
}

export default IEmployee
