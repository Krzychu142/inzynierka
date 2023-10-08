import Employee, { IEmployee } from '../models/employee.model'

class EmployeeService {
  static getAllEmployees(): Promise<IEmployee[]> {
    return Employee.find()
  }

  static getSingleEmployee(id: string): Promise<IEmployee | null> {
    return Employee.findById(id);
  }
}

export default EmployeeService
