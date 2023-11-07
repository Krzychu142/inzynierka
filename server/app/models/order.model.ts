import { Schema, model } from 'mongoose';
import { IProduct } from './product.model';
import { IClient } from './client.model';
import { OrderStatus } from '../types/orderStatus.enum';

export interface IOrderItem {
  product: IProduct;
  quantity: number;
}

export interface IOrder {
  client: IClient;
  items: IOrderItem[];
  address: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new Schema<IOrder>({
  client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  items: [orderItemSchema],
  address: { type: String, required: true },
  status: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

orderSchema.pre('save', function (next) {
  if (this.isNew) {
    this.createdAt = new Date();
  } else {
    this.updatedAt = new Date();
  }
  next();
});

export default model<IOrder>('Order', orderSchema);
