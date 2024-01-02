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

  describe('given token with the role warehouseman (do not have permission)', () => {
    it("should return 403 code and message 'You don't have permission to do this'", async () => {
      const response = await supertest(appInstance)
        .get('/employees/get')
        .set('Authorization', `Bearer ${warehousemanToken}`)

      expect(response.status).toBe(403)
      expect(response.body.message).toBe("You don't have permission to do this")
    })
  })
})

describe('GET /employees/:id', () => {
  describe('given token with the role manager and _id of a existing employee', () => {
    it('should return 200 code and employee with provided _id', async () => {
      const response = await supertest(appInstance)
        .get(`/employees/${testWarehouseEmployee._id}`)
        .set('Authorization', `Bearer ${managerToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('_id')
      expect(typeof response.body._id).toBe('string')
      expect(response.body._id.toString()).toBe(
        testWarehouseEmployee._id.toString(),
      )
    })
  })

  describe('given token with the role manager and _id of a non-existing employee', () => {
    it("should return 404 code and message 'Employee doesn't exist'", async () => {
      const randomMongoId = new mongoose.Types.ObjectId().toString()
      const response = await supertest(appInstance)
        .get(`/employees/${randomMongoId}`)
        .set('Authorization', `Bearer ${managerToken}`)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe("Employee doesn't exist")
    })
  })
})

describe('DELETE /employees/delete', () => {
  describe('given token with the role manager and email of existing employee (on request.body)', () => {
    it('should delete the employee and return 200 status', async () => {
      const userForDelete = await createTestEmployee(
        Role.CARTOPERATOR,
        'marek155@gmail.com',
      )

      const response = await supertest(appInstance)
        .delete('/employees/delete')
        .send({ email: userForDelete.email })
        .set('Authorization', `Bearer ${managerToken}`)

      expect(response.status).toBe(200)
      expect(response.body.message).toBe('Employee deleted successful')
    })
  })

  describe('given token with the role manager and email of non-existing employee', () => {
    it('should return 404 and message "Employee not found"', async () => {
      const response = await supertest(appInstance)
        .delete('/employees/delete')
        .send({ email: 'random123xyz@email.com' })
        .set('Authorization', `Bearer ${managerToken}`)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Employee not found')
    })
  })

  describe('given token with the role manager and do not provide email of employee to delete', () => {
    it('should return 400 and message "The email parameter is missing"', async () => {
      const response = await supertest(appInstance)
        .delete('/employees/delete')
        .set('Authorization', `Bearer ${managerToken}`)

      expect(response.status).toBe(400)
      expect(response.body.message).toBe('The email parameter is missing')
    })
  })
})

describe('PUT /employees/:id', () => {
  describe('given a token with the role of manager, new data in the request body, and the _id of an existing employee in the parameters', () => {
    it('should update the employee data and return 202 status', async () => {
      const newEmployeeData = {
        name: 'NewTest',
        surname: 'UpdatedSurname',
      }

      const response = await supertest(appInstance)
        .put(`/employees/${testWarehouseEmployee._id}`)
        .send(newEmployeeData)
        .set('Authorization', `Bearer ${managerToken}`)

      expect(response.status).toBe(202)
      expect(response.body).toHaveProperty('name', 'NewTest')
      expect(response.body).toHaveProperty('surname', 'UpdatedSurname')
    })
  })

  describe('given a token with the role of manager, no new data in the request body, and the _id of an existing employee in the parameters', () => {
    it('should return a 400 status when employee data is missing', async () => {
      const response = await supertest(appInstance)
        .put(`/employees/${testWarehouseEmployee._id}`)
        .send({})
        .set('Authorization', `Bearer ${managerToken}`)

      expect(response.status).toBe(400)
      expect(response.body.message).toBe('Employee data is missing')
    })
  })

  describe('given a token with the role of manager, and the _id of a non-existing employee in the parameters', () => {
    it("should return a 404 status and message 'Employee not found'", async () => {
      const nonExistingId = new mongoose.Types.ObjectId().toString()

      const newEmployeeData = {
        name: 'NewTest',
        surname: 'UpdatedSurname',
      }

      const response = await supertest(appInstance)
        .put(`/employees/${nonExistingId}`)
        .send(newEmployeeData)
        .set('Authorization', `Bearer ${managerToken}`)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Employee not found')
    })
  })
})
