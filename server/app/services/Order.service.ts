import Order from '../models/order.model';
import mongoose from 'mongoose';
import { OrderStatus } from '../types/orderStatus.enum';
import { IOrderProduct } from '../types/orderProduct.interface';
import { IOrder } from '../types/order.interface';

class OrderService {
    static async createOrder(
        clientID: mongoose.Types.ObjectId,
        orderProducts: IOrderProduct[],
        status: OrderStatus,
        orderDate?: Date,
        session?: mongoose.ClientSession
    ): Promise<IOrder> {
        const orderData: Partial<IOrder> = {
            client: clientID,
            products: orderProducts,
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

    static async findOrdersByClient(clientId: mongoose.Types.ObjectId): Promise<IOrder[]> {
        return Order.find({ client: clientId })
        .populate('client')
        .populate({
            path: 'products.product',
        });
    }

    static async getAllOrders(): Promise<IOrder[]> {
        return Order.find()
        .populate('client') 
        .populate({
            path: 'products.product',
        });
    }
}

export default OrderService;
