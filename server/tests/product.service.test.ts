import ProductService from '../app/services/Product.service';
import Product from '../app/models/product.model';

jest.mock("../app/models/product.model")

describe('Product service', () => {
  it('should return array with products', async () => {
        const mockProducts = [
      {
        "soldAt": null,
        "_id": "649597ff082021ace01b1b24",
        "sku": "123456789",
        "name": "Przykładowy Produkt",
        "description": "To jest opis przykładowego produktu.",
        "stockQuantity": 100,
        "price": 59.99,
        "promotionalPrice": 49.99,
        "isOnSale": true,
        "isAvailable": true,
        "images": [
            "https://example.com/image1.jpg",
            "https://example.com/image2.jpg"
        ],
        "initialStockQuantity": 100,
        "addedAt": "2023-06-23T00:00:00.000Z"
      },
      {
        "_id": "6522ba4a7409451e03bdea2b",
        "sku": "ABC12345",
        "name": "Przykładowy Produkt",
        "description": "To jest opis przykładowego produktu dostępnego w naszym sklepie.",
        "stockQuantity": 100,
        "price": 49.99,
        "promotionalPrice": 39.99,
        "isOnSale": true,
        "isAvailable": true,
        "images": [
            "https://picsum.photos/seed/picsum/200/300",
            "https://picsum.photos/seed/picsum/200/300",
            "https://picsum.photos/seed/picsum/200/300"
        ],
        "initialStockQuantity": 100,
        "addedAt": "2023-10-08T12:00:00.000Z",
        "soldAt": null,
        "__v": 0
      }
    ];

    const spy = jest.spyOn(Product, 'find').mockResolvedValue(mockProducts as any);

    const result = await ProductService.getAllProducts();
    expect(spy).toHaveBeenCalled();
    expect(result).toEqual(mockProducts)
  });

  it('should create new product', async () => {
    
    const mockProduct = {
    "sku": "ABC12345",
    "name": "Przykładowy Produkt",
    "description": "To jest opis przykładowego produktu dostępnego w naszym sklepie.",
    "stockQuantity": 100,
    "price": 49.99,
    "promotionalPrice": 39.99,
    "isOnSale": true,
    "isAvailable": true,
    "images": [
      "https://picsum.photos/seed/picsum/200/300",
      "https://picsum.photos/seed/picsum/200/300",
      "https://picsum.photos/seed/picsum/200/300"
    ],
    "initialStockQuantity": 100
  }

    const spy = jest.spyOn(Product, 'create').mockResolvedValue(mockProduct as any)
    const result = await ProductService.createProduct(mockProduct)

    expect(spy).toHaveBeenCalledWith(mockProduct)
    expect(result).toBe(mockProduct)
  })

});
