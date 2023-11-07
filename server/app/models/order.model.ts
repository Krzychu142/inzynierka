import { Schema, model, Document } from 'mongoose';
import { IClient } from './client.model';
import { IProduct } from './product.model';
import { OrderStatus } from '../types/orderStatus.enum';

export interface IOrder extends Document {
  client: IClient['_id'];
  products: IProduct['_id'][];
  orderDate: Date;
  status: OrderStatus;
}

const orderSchema = new Schema<IOrder>({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }],
  orderDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING
  },
});

export default model<IOrder>('Order', orderSchema);