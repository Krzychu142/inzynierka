import { Document } from "mongoose";
import { IClient } from "./client.interface";
import { IOrderProduct } from "./orderProduct.interface";
import { OrderStatus } from "./orderStatus.enum";

export interface IOrder extends Document {
  client: IClient['_id'];
  products: IOrderProduct[];
  orderDate: Date;
  status: OrderStatus;
}