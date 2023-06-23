import Employee from '../models/employee.model'

class EmployeeService {
  static async getAllEmployees() {
    return Employee.find()
  }
}

export default EmployeeService
