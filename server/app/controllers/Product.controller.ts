import { Request, Response } from 'express'
import ProductService from '../services/Product.service'
import ErrorsHandlers from '../utils/helpers/ErrorsHandlers'
import ensureIdExists from '../utils/helpers/ensureIdExists'
import S3StorageManager from '../utils/S3StorageManager'
import CustomError from '../utils/helpers/CustomError'

class ProductController {
  private static readonly BUCKET_NAME =
    process.env.AWS_S3_BUCKET_NAME ?? 'yourwarehouse'

  static async getAllProduct(req: Request, res: Response): Promise<void> {
    try {
      const products = await ProductService.getAllProducts()
      res.status(201).json(products)
    } catch (error: unknown) {
      ErrorsHandlers.handleCustomError(error, res);
    }
  }

  static async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const product = await ProductService.createProduct(req.body)
      if (!product) {
        throw new CustomError('Product was not created.');
      }

      res.status(201).json({ message: 'Product created successfully', product })
    } catch (error: unknown) {
      ErrorsHandlers.handleCustomError(error, res);
    }
  }

  static async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body.id) {
        throw new CustomError('The id parameter is missing', 400);
      } else {
        const result = await ProductService.deleteProduct(req.body.id)
        if (result.deletedCount !== 0) {
          res.status(200).json({ message: 'The product has been removed' })
        } else {
          throw new CustomError('The product was not found', 404);
        }
      }
    } catch (error: unknown) {
      ErrorsHandlers.handleCustomError(error, res);
    }
  }

  static async getSingleProduct(req: Request, res: Response): Promise<void> {
    try {
      ensureIdExists(req)
      const product = await ProductService.getSingleProduct(req.params.id)

      if(!product) {
        throw new CustomError('The product was not found', 404);
      }
      
      res.status(200).json(product);
    } catch (error: unknown) {
      ErrorsHandlers.handleCustomError(error, res);
    }
  }

  static async editProduct(req: Request, res: Response): Promise<void> {
    try {
      ensureIdExists(req)
      const { id, ...editedProductWithoutId } = req.body
      const updatedProduct = await ProductService.editProduct(
        req.params.id,
        editedProductWithoutId,
      )

      if (!updatedProduct) {
        throw new CustomError('The product was not found', 404);
      }

      res.status(200).json(updatedProduct);
    } catch (error: unknown) {
      ErrorsHandlers.handleCustomError(error, res);
    }
  }

  static async uploadImageToProduct(req: Request, res: Response): Promise<void> {
    try {
      ensureIdExists(req)

      if (!req.file) {
        throw new CustomError('Image is missing.', 400);
      }

      const product = await ProductService.getSingleProduct(req.params.id)
      if (!product) {
        throw new CustomError('The product was not found', 404);
      }

      const fileContent = req.file.buffer
      const fileName = req.file.originalname + new Date().getTime()
      const contentType = req.file.mimetype

      const s3StorageManager = S3StorageManager.getInstance()
      const uploadResult = await s3StorageManager.uploadFile(
        ProductController.BUCKET_NAME,
        fileName,
        fileContent,
        contentType,
      )

      const updatedImages = [...product.images, uploadResult.Location]
      const updatedProduct = await ProductService.updateProductImages(
        req.params.id,
        updatedImages,
      )

      res.status(200).json({
        message: 'Image uploaded and product updated successfully',
        product: updatedProduct,
      })
    } catch (error: unknown) {
      ErrorsHandlers.handleCustomError(error, res);
    }
  }

  static async deleteImageByURL(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body.url) {
        throw new CustomError('URL parameter is missing.', 400);
      }

      const s3StorageManager = S3StorageManager.getInstance()
      const deleteResult = await s3StorageManager.deleteFileByUrl(
        req.body.url,
        ProductController.BUCKET_NAME,
      )

      if (!deleteResult) {
        throw new CustomError("Can't delete this image.", 500);
      }

      res.status(200).json({ message: 'Image deleted successfully', data: deleteResult })
    } catch (error: unknown) {
      ErrorsHandlers.handleCustomError(error, res);
    }
  }
}

export default ProductController
