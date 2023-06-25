import { Request, Response } from 'express'
import ProductService from '../services/Product.service'
import errorHandler from '../helpers/errorHandler'

class ProductController {
  static async getAllProduct(req: Request, res: Response): Promise<void> {
    try {
      const products = await ProductService.getAllProducts()
      res.json(products)
    } catch (error: unknown) {
      const errorMessages = errorHandler(error)
      res.status(500).json(errorMessages)
    }
  }
}

export default ProductController
