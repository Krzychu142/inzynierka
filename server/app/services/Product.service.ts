import mongoose from 'mongoose';
import Product from '../models/product.model'
import { IProduct } from '../types/product.interface';

class ProductService {

  static async getAllProducts(): Promise<IProduct[]> {
    return Product.find()
  }

  static async createProduct(product: IProduct): Promise<IProduct> {
    return Product.create(product)
  }

  static async deleteProduct(id: string){
    const objectId = new mongoose.Types.ObjectId(id);
    return Product.deleteOne({ _id: objectId });
  }

  static async getSingleProduct(id: string){
    const objectId = new mongoose.Types.ObjectId(id);
    return Product.findById(objectId)
  }

  static async editProduct(id: string, editedProduct: IProduct) {
    return Product.findByIdAndUpdate(id, editedProduct, { new: true });
  }

  static async getSingleProductBySKU(sku: string): Promise<IProduct | null> {
    return Product.findOne({ sku: sku });
  }

  static async decrementProductStock(productId: string, quantityToDeduct: number, session: mongoose.ClientSession): Promise<IProduct | null> {
      const product = await Product.findOne({ _id: productId }).session(session);

      if (product && product.stockQuantity >= quantityToDeduct) {
          product.stockQuantity -= quantityToDeduct;
          if (product.stockQuantity === 0) {
              product.isAvailable = false;
              product.soldAt = new Date();
          }
          await product.save({ session });
          return product;
      } else {
          throw new Error(`Insufficient stock for product id: ${productId}.`);
      }
  }

  static async incrementProductStock(productId: string, quantityToAdd: number, session: mongoose.ClientSession): Promise<IProduct | null> {
      const product = await Product.findOne({ _id: productId }).session(session);

      if (product) {
          product.stockQuantity += quantityToAdd;
          if (product.stockQuantity > 0 && !product.isAvailable) {
              product.isAvailable = true;
          }
          await product.save({ session });
          return product;
      } else {
          throw new Error(`Product with SKU: ${productId} not found.`);
      }
  }

  static async updateProductImages(id: string, images: string[]) {
    return Product.findByIdAndUpdate(
      id, 
      { $set: { images: images } }, 
      { new: true }
    );
  }

}

export default ProductService
