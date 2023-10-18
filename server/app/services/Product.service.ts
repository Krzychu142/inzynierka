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
}

export default ProductService
