import request from 'supertest'
import express from 'express'
import AuthService from '../app/services/Auth.service'

jest.mock('../app/services/Auth.service')

const testApp = express()
testApp.use('/auth/register')

describe('Auth', () => {
  test('should register new user', async () => {})
})
