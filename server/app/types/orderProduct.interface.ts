import { IProduct } from "./product.interface";

export interface IOrderProduct {
  product: IProduct['_id'];
  quantity: number;
  priceAtOrder: number;
  currencyAtOrder: string;
}