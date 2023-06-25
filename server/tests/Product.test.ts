import request from 'supertest'
import express from 'express'
import ProductService from '../app/services/Product.service'

jest.mock('../app/services/Product.service')

const testApp = express()
testApp.use('/products/getAllProducts', (req, res) => {
    ProductService.getAllProducts().then((data) => res.json(data))
})

describe('Product', () => {
    test('should return all products', async () => {
        const mockProducts = [
            {
                _id: '649597ff082021ace01b1b24',
                sku: '123456789',
                name: 'Przykładowy Produkt',
                description: 'To jest opis przykładowego produktu.',
                stockQuantity: 100,
                price: 59.99,
                promotionalPrice: 49.99,
                isOnSale: true,
                isAvailable: true,
                images: [
                    'https://example.com/image1.jpg',
                    'https://example.com/image2.jpg',
                ],
                initialStockQuantity: 100,
                addedAt: '2023-06-23T00:00:00Z',
            },
        ]

            ; (ProductService.getAllProducts as jest.Mock).mockResolvedValue(
                mockProducts,
            )

        const response = await request(testApp).get('/products/getAllProducts')

        expect(response.status).toBe(200)
        expect(response.body).toEqual(mockProducts)
    })
})
