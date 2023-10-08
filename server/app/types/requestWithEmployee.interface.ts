import { Request } from 'express';
import { IEmployee } from '../models/employee.model'

interface IRequestWithEmployee extends Request {
    employee?: IEmployee
}

export default IRequestWithEmployee