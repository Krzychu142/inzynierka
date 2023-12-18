import supertest from 'supertest'
import App from '../../app/app'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import Employee, { IEmployee } from '../../app/models/employee.model'
import Crypt from '../../app/utils/helpers/Crypt'
import TokenService from '../../app/services/Token.service'
import { Role } from '../../app/types/role.enum'

async function createTestEmployee(
  role: Role,
  randomEmail: string,
): Promise<IEmployee> {
  const hashedPassword = await Crypt.hashPassword('test142@')

  const testEmployeeData = new Employee({
    name: 'Test',
    surname: 'User',
    employedAt: new Date(),
    email: randomEmail,
    password: hashedPassword,
    role: role,
    salary: 5000,
    contractType: 'Employment Contract',
    address: 'Test Street 123',
    city: 'Test City',
    country: 'Test Country',
    postalCode: '12345',
    phoneNumber: '+48-123-456-789',
    birthDate: new Date('1990-01-01'),
    passwordResetToken: null,
  })

  await testEmployeeData.save()
  return testEmployeeData
}

let mongoServer: MongoMemoryServer
let appInstance = App.getInstance().getExpressApp()

let testManagerEmployee: IEmployee
let managerToken: string

let testWarehouseEmployee: IEmployee
let warehousemanToken: string

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)

  testManagerEmployee = await createTestEmployee(
    Role.MANAGER,
    'test142@gmail.com',
  )
  managerToken = TokenService.generateToken(testManagerEmployee)

  testWarehouseEmployee = await createTestEmployee(
    Role.WAREHOUSEMAN,
    'test162@gmail.com',
  )
  warehousemanToken = TokenService.generateToken(testWarehouseEmployee)
})

afterAll(async () => {
  await Employee.deleteOne({ _id: testManagerEmployee._id })
  await Employee.deleteOne({ _id: testWarehouseEmployee._id })

  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('GET /employees/get', () => {
  describe('given token for an existing employee, with the role of manager', () => {
    it('should return 201 all code and array with all employees', async () => {
      const response = await supertest(appInstance)
        .get('/employees/get')
        .set('Authorization', `Bearer ${managerToken}`)

      expect(response.status).toBe(201)
      expect(response.body).toBeInstanceOf(Array)
    })
  })

  describe('given token with role warehouseman', () => {
    it("should return 403 code and message 'You don't have permission to do this'", async () => {
      const response = await supertest(appInstance)
        .get('/employees/get')
        .set('Authorization', `Bearer ${warehousemanToken}`)

      expect(response.status).toBe(403)
      expect(response.body.message).toBe("You don't have permission to do this")
    })
  })
})
