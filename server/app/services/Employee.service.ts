import Employee, { IEmployee } from '../models/employee.model'
import ErrorsHandlers from '../utils/helpers/ErrorsHandlers';

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

  static async editEmployee(id: string, editedEmployee: IEmployee): Promise<IEmployee | null> {
    try {
      return Employee.findByIdAndUpdate(id, editedEmployee, { new: true });
    }  catch (error: unknown) {
      ErrorsHandlers.handleMongoError(error);
    }
  }
}

export default EmployeeService
