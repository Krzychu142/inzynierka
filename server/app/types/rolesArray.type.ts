import { Role } from './role.enum'

type RolesArray = Array<(typeof Role)[keyof typeof Role]>

export default RolesArray
