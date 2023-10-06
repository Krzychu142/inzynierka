import Employee, { IEmployee } from '../models/employee.model'

class EmployeeService {
  static getAllEmployees(): Promise<IEmployee[]> {
    return Employee.find()
  }
}

export default EmployeeService
