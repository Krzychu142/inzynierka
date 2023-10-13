import Product, { IProduct } from '../models/product.model'

class ProductService {
  static async getAllProducts(): Promise<IProduct[]> {
    return Product.find()
  }

  static async createProduct(product: IProduct): Promise<IProduct> {
    return Product.create(product)
  }
}

export default ProductService
