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

  static async deleteProduct(req: Request, res: Response):
  Promise<void> {
    try {
      const id = req.body.id;
      if(!id) {
        res.status(400).send({ message: 'The id parameter is missingClick to apply' }) 
      }
      const result = await ProductService.deleteProduct(id);
      if (result.deletedCount === 0) {
          res.status(404).send({ message: 'The product with the specified id was not found' });
      }
      res.status(201).send({ message: 'The product has been removed' });
    } catch (error: unknown) {
      res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
    }
  }
}

export default ProductController
