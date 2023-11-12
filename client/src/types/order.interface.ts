import { IClient } from './client.interface';
import { IProduct } from './product.interface';

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export interface IOrder {
  _id: string;
  client: IClient;
  products: IProduct[];
  orderDate: Date;
  status: OrderStatus;
}
