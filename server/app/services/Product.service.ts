import Product, { IProduct } from '../models/product.model'

class ProductService {
  static async getAllProducts(): Promise<IProduct[]> {
    return Product.find()
  }
}

export default ProductService
