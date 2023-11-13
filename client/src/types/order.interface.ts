import { IClient } from './client.interface';
import { IOrderProduct } from './orderProduct.interface';

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export interface IOrder {
  _id: string;
  client: IClient;
  products: IOrderProduct[];
  orderDate: Date;
  status: OrderStatus;
}
