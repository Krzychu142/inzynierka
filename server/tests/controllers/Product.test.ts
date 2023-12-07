import ProductController from '../../app/controllers/Product.controller'
import ProductService from '../../app/services/Product.service'
import { Request, Response } from 'express'
import supertest from 'supertest'
import jwt from 'jsonwebtoken'
import App from '../../app/app'
import { Types } from 'mongoose'

jest.mock('../../app/services/Product.service')

const mockProduct = {
  sku: 'ABC1334dd5',
  name: '3D printer - Flashforge Adventurer 3 Pro 2',
  description:
    'Another great offering from Flashforge . Adventurer 3 Pro 2 offers increased printing speed, an improved cooling system and a PEI-coated plate known for excellent adhesion and easy detachment of prints. The dimensions of the printer are 388 x 340 x 405 mm and its working area is 150 x 150 x 150 mm.',
  stockQuantity: 21,
  price: 499.99,
  currency: '$',
  promotionalPrice: 399.99,
  isOnSale: true,
  isAvailable: true,
  images: [
    'https://cdn1.botland.store/121530/3d-printer-flashforge-adventurer-3-pro-2.jpg',
    'https://cdn1.botland.store/121531/3d-printer-flashforge-adventurer-3-pro-2.jpg',
    'https://cdn1.botland.store/121529/3d-printer-flashforge-adventurer-3-pro-2.jpg',
  ],
  initialStockQuantity: 21,
}

const createMockResponse = () => {
  const res = {} as Response
  res.status = jest.fn().mockReturnThis()
  res.json = jest.fn()
  return res
}

describe('ProductController', () => {
  describe('given the correct IProduct object', () => {
    it('should send a status code of 201 and new product object when successfully created new product', async () => {
      ProductService.createProduct = jest.fn().mockResolvedValue(mockProduct)
      const req = { body: mockProduct } as Request
      const res = createMockResponse()

      await ProductController.createProduct(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Product created successfully',
        product: mockProduct,
      })
    })
  })
  describe('given the IProduct object with SKU which is already in database', () => {
    it('should send a status code of 500 and error message when creation fails', async () => {
      const errorMessage = 'Product was not created.'
      ProductService.createProduct = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage))
      const req = { body: mockProduct } as Request
      const res = createMockResponse()

      await ProductController.createProduct(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: errorMessage,
      })
    })
  })

  // integration
  describe('get product route', () => {
    describe('given the user is not logged in', () => {
      it('should return status 500 with message Unauthorized', async () => {
        const fakeProductId = new Types.ObjectId()
        const fakeUserId = new Types.ObjectId()

        const userPayload = {
          id: fakeUserId,
          role: 'MANAGER',
        }

        const secretKey = process.env.JWT_SECRET_KEY
        if (!secretKey) {
          throw new Error('JWT_SECRET_KEY is not defined')
        }

        const token = jwt.sign(userPayload, secretKey)

        const app = App.getInstance()
        app.start()

        const {} = await supertest(app.getExpressApp())
          .get(`/products/${fakeProductId}`)
          .set('Authorization', `Bearer ${token}`)
      })
    })
  })
})
