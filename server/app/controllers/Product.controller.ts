import { Request, Response } from 'express'
import ProductService from '../services/Product.service'
import ErrorsHandlers from '../utils/helpers/ErrorsHandlers'

class ProductController {
  static async getAllProduct(req: Request, res: Response): Promise<void> {
    try {
      const products = await ProductService.getAllProducts()
      res.json(products)
    } catch (error: unknown) {
      res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
    }
  }

  static async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const product = await ProductService.createProduct(req.body)
      if (product) {
        res.status(201).json({ message: 'Product created successfully' })
      }
    } catch (error: unknown) {
      res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
    }
  }
}

export default ProductController
