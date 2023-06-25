import Product from '../models/product.model'

class ProductService {
  static async getAllProducts() {
    return Product.find()
  }
}

export default ProductService
