import supertest from 'supertest'
import App from '../../app/app'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import Employee from '../../app/models/employee.model'
import IEmployee from '../../app/types/employee.interface'
import Crypt from '../../app/utils/helpers/Crypt'
import TokenService from '../../app/services/Token.service'

async function createTestEmployee(): Promise<IEmployee> {
  const hashedPassword = await Crypt.hashPassword('test142@')

  const testEmployeeData = new Employee({
    name: 'Test',
    surname: 'User',
    employedAt: new Date(),
    email: 'testuser@example.com',
    password: hashedPassword,
    role: 'manager',
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

let testEmployee: IEmployee
let token: string
let mongoServer: MongoMemoryServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)
  testEmployee = await createTestEmployee()
  token = TokenService.generateToken(testEmployee)
})

afterAll(async () => {
  await Employee.deleteOne({ _id: testEmployee._id })
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('GET /employees/get', () => {
  it('should return all employees for authorized user', async () => {
    const appInstance = App.getInstance().getExpressApp()

    const response = await supertest(appInstance)
      .get('/employees/get')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(201)
    expect(response.body).toBeInstanceOf(Array)
  })
})
