import Employee, { IEmployee } from '../models/employee.model'

class EmployeeService {
  static async getAllEmployees(): Promise<IEmployee[]> {
    return Employee.find()
  }

  static async getSingleEmployee(id: string): Promise<IEmployee | null> {
    return Employee.findById(id);
  }

  static async deleteSingleEmployee(email: string) {
    return Employee.deleteOne({email: email});
  }
}

export default EmployeeService
