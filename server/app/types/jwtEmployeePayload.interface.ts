import { JwtPayload } from 'jsonwebtoken'
import { Role } from './role.enum'

interface IJwtEmployeePayload extends JwtPayload {
  _id: string
  email: string
  role: Role
}

export default IJwtEmployeePayload
