import Order, { IOrder } from '../models/order.model';
import mongoose from 'mongoose';
import { OrderStatus } from '../types/orderStatus.enum';

class OrderService {
    static async createOrder(
        clientID: mongoose.Types.ObjectId,
        productIDs: mongoose.Types.ObjectId[],
        status: OrderStatus,
        orderDate?: Date,
        session?: mongoose.ClientSession
    ): Promise<IOrder> {
        const orderData: Partial<IOrder> = {
            client: clientID,
            products: productIDs,
            status: status
        };

        if (orderDate) {
            orderData.orderDate = orderDate;
        }
        
        const newOrder = new Order(orderData);

        if (session) {
            return newOrder.save({ session });
        } else {
            return newOrder.save();
        }
    }
}

export default OrderService;
