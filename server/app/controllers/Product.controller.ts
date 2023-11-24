import { Request, Response } from 'express'
import ProductService from '../services/Product.service'
import ErrorsHandlers from '../utils/helpers/ErrorsHandlers'
import ensureIdExists from '../utils/helpers/ensureIdExists'
import S3StorageManager from '../utils/S3StorageManager'
import fs from "fs"

class ProductController {
  static async getAllProduct(req: Request, res: Response): Promise<void> {
    try {
      const products = await ProductService.getAllProducts()
      res.status(201).json(products)
    } catch (error: unknown) {
      res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
    }
  }

  static async createProduct(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body, "req.body")
      console.log(req.files, "req.files")
      const bucketName = process.env.AWS_S3_BUCKET_NAME ?? "yourwarehouse";

      if (!req.files || !Array.isArray(req.files)) {
        throw new Error("No files uploaded");
      }
      const s3Manager = S3StorageManager.getInstance();
      const uploadedImages = [];

      for (const file of req.files) {
        const fileContent = fs.readFileSync(file.path);

        const fileName = `uploads/${file.originalname}`;

        const uploadResult = await s3Manager.uploadFile(bucketName, fileName, fileContent, file.mimetype);

        uploadedImages.push(uploadResult.Location);

        fs.unlinkSync(file.path);
      }

      const productData = {
        ...req.body,
        images: uploadedImages,
      };

      const product = await ProductService.createProduct(productData);

      res.status(201).json({ message: 'Product created successfully', product });
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
      ensureIdExists(req);
      const product = await ProductService.getSingleProduct(req.params.id)
      if (product) {
        res.status(201).json(product)
      } else {
        res.status(404).json({
          message: "The product was not found"
        })
      }
    } catch (error: unknown) {
      res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
    }
  }

  static async editProduct(req: Request, res: Response):
  Promise<void> {
    try {
    ensureIdExists(req);
    const { id, ...editedProductWithoutId } = req.body;
    const updatedProduct = await ProductService.editProduct(req.params.id, editedProductWithoutId);
    if (updatedProduct) {
      res.status(202).json(updatedProduct);
    } else {
      res.status(404).json({ message: "The product was not found" });
    }
    } catch (error: unknown) {
      res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
    }
  }
}

export default ProductController
