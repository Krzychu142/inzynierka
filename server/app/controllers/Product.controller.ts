import { Request, Response } from 'express'
import ProductService from '../services/Product.service'
import ErrorsHandlers from '../utils/helpers/ErrorsHandlers'

class ProductController {
  static async getAllProduct(req: Request, res: Response): Promise<void> {
    try {
      const products = await ProductService.getAllProducts()
      res.json(products)
    } catch (error: unknown) {
      const errorMessages = ErrorsHandlers.errorMessageHandler(error)
      res.status(500).json(errorMessages)
    }
  }

  static async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const product = await ProductService.createProduct(req.body)
      if (product) {
        res.status(201).json({ message: 'Product created successfully' })
      }
    } catch (error: unknown) {
      const errorMessages = ErrorsHandlers.errorMessageHandler(error)
      res.status(500).json(errorMessages)
    }
  }
}

export default ProductController
