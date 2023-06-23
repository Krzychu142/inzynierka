import request from 'supertest'
import express from 'express'
import EmployeeService from '../app/services/Employee.service'

jest.mock('../app/services/Employee.service')

const testApp = express()
testApp.use('/employees/getAllEmployees', (req, res) => {
  EmployeeService.getAllEmployees().then((data) => res.json(data))
})

describe('Employee', () => {
  test('should return all employees', async () => {
    const mockEmployees = [
      {
        _id: '6495adc0082021ace087931c',
        name: 'Jan',
        surname: 'Kowalski',
        employedAt: '2023-06-23T00:00:00Z',
        email: 'jan.kowalski@example.com',
        password: 'hashedPassword1',
        role: 'manager',
        salary: 6000,
        address: 'ul. Przykładowa 1',
        city: 'Warszawa',
        country: 'Polska',
        postalCode: '00-001',
        phoneNumber: '123456789',
        birthDate: '1980-01-01T00:00:00Z',
        tokenVersion: 0,
        isVerified: true,
      },
      {
        _id: '6495adc0082021ace087931d',
        name: 'Anna',
        surname: 'Nowak',
        employedAt: '2023-01-01T00:00:00Z',
        email: 'anna.nowak@example.com',
        password: 'hashedPassword2',
        role: 'salesman',
        salary: 4000,
        address: 'ul. Przykładowa 2',
        city: 'Kraków',
        country: 'Polska',
        postalCode: '30-001',
        phoneNumber: '987654321',
        birthDate: '1985-01-01T00:00:00Z',
        tokenVersion: 0,
        isVerified: false,
      },
    ]

    ;(EmployeeService.getAllEmployees as jest.Mock).mockResolvedValue(
      mockEmployees,
    )

    const response = await request(testApp).get('/employees/getAllEmployees')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(mockEmployees)
  })
})
