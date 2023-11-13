import { IProduct } from "./product.interface";

export interface IOrderProduct {
  product: IProduct;
  quantity: number;
  priceAtOrder: number;
  currencyAtOrder: string;
}
