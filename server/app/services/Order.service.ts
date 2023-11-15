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

    static async deleteOrdersByClientId(clientId: mongoose.Types.ObjectId): Promise<number> {
        const result = await Order.deleteMany({ client: clientId });
        return result.deletedCount || 0;
    }

    static async getSingleOrder(orderId: string): Promise<IOrder | null> {
        const result = await Order.findById(orderId)
        return result
    }

    static async deleteOrder(orderId: mongoose.Types.ObjectId, session?: mongoose.ClientSession): Promise<mongoose.mongo.DeleteResult> {
        const options = session ? { session } : {};
        const result = await Order.deleteOne({_id: orderId}, options)
        return result
    }
}

export default OrderService;
