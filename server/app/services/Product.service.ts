import mongoose from 'mongoose';
import Product, { IProduct } from '../models/product.model'

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

  static async updateProductStock(sku: string, quantityToDeduct: number, session: mongoose.ClientSession): Promise<IProduct | null> {
      const product = await Product.findOne({ sku: sku }).session(session);

      if (product && product.stockQuantity >= quantityToDeduct) {
          product.stockQuantity -= quantityToDeduct;
          if (product.stockQuantity === 0) {
              product.isAvailable = false;
          }
          await product.save({ session });
          return product;
      } else {
          throw new Error(`Insufficient stock for product SKU: ${sku}.`);
      }
  }

}

export default ProductService
