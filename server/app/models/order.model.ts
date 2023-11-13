import { Schema, model } from 'mongoose';
import { OrderStatus } from '../types/orderStatus.enum';
import { IOrderProduct } from '../types/orderProduct.interface';
import { IOrder } from '../types/order.interface';

const orderProductSchema = new Schema<IOrderProduct>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  priceAtOrder: {
    type: Number,
    required: true
  }
});

const orderSchema = new Schema<IOrder>({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  products: [orderProductSchema],
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