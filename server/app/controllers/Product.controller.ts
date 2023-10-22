import { Request, Response } from 'express'
import ProductService from '../services/Product.service'
import ErrorsHandlers from '../utils/helpers/ErrorsHandlers'

class ProductController {
  private static ensureIdExists(req: Request): void {
      if (!req.params.id) {
          throw new Error('The id parameter is missing');
      }
  }

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
      if(!req.body.id) {
        res.status(400).json({ message: 'The id parameter is missing' }) 
      } else {
        const result = await ProductService.deleteProduct(req.body.id);
        if (result.deletedCount !== 0) {
          res.status(201).json({ message: 'The product has been removed' });
        } else {
          res.status(404).json({
            message: "The product was not found"
          })
        }
      }
    } catch (error: unknown) {
      res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
    }
  }

  static async getSingleProduct(req: Request, res: Response):
  Promise<void> {
    try {
      ProductController.ensureIdExists(req);
      const product = await ProductService.getSingleProduct(req.params.id)
      if (product) {
        res.status(201).json(product)
      } else {
        res.status(404).json({
          message: "The product was not found"
        })
      }
    } catch (error) {
      res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
    }
  }

  static async editProduct(req: Request, res: Response):
  Promise<void> {
    try {
    ProductController.ensureIdExists(req);
    const { id, ...editedProductWithoutId } = req.body;
    const updatedProduct = await ProductService.editProduct(req.params.id, editedProductWithoutId);
    if (updatedProduct) {
      res.status(202).json(updatedProduct);
    } else {
      res.status(404).json({ message: "The product was not found" });
    }
    } catch (error) {
      res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
    }
  }
}

export default ProductController
