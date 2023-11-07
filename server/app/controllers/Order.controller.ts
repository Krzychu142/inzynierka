import { Request, Response } from 'express'
import ErrorsHandlers from '../utils/helpers/ErrorsHandlers'
import ClientService from '../services/Client.service';
import ProductService from '../services/Product.service';
import mongoose from 'mongoose';
import OrderService from '../services/Order.service';
import { OrderStatus } from '../types/orderStatus.enum';

class OrderController {
    static async createOrder(req: Request, res: Response): Promise<void> {
        const session = await mongoose.startSession();
        try {
            session.startTransaction(); 
            const { clientEmail, items, status } = req.body;

            if (!clientEmail) {
                throw new Error("Client email is missing.")
            }

            if (!Array.isArray(items) || items.length === 0) { 
                throw new Error("Order must have at least one item.");
            }

            const client = await ClientService.getClientByEmail(clientEmail)

            if (!client) {
                throw new Error("Client not found.")
            }

            const productIDs: mongoose.Types.ObjectId[] = [];
            
            for (const item of items) {
                const product = await ProductService.getSingleProductBySKU(item.productSKU);

                if (!product) {
                    throw new Error(`Product with SKU ${item.productSKU} was not found.`);
                }

                if (!product.isAvailable) {
                    throw new Error(`Product ${item.productSKU} is not available.`);
                }

                if (product.stockQuantity < item.quantity) {
                    throw new Error(`Insufficient stock for product SKU: ${item.productSKU}.`);
                }

                await ProductService.updateProductStock(item.productSKU, item.quantity, session);

                productIDs.push(product._id);
            }

            const orderDate = req.body.orderDate ? new Date(req.body.orderDate) : undefined;

            const order = await OrderService.createOrder(
                client._id,
                productIDs,
                status || OrderStatus.PENDING,
                orderDate,
                session
            );

            await ClientService.incrementOrderCount(client._id, session);

            await session.commitTransaction();

            res.status(201).json(order);

        } catch (error: unknown) {
            await session.abortTransaction();
            res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
        } finally {
            await session.endSession();
        }
    }

    static async getOrdersByClient(req: Request, res: Response): Promise<void> {
        try {
            if (!req.params.email) {
                throw new Error("Client email is missign.")
            }

            const client = await ClientService.getClientByEmail(req.params.email);

            if (!client) {
                throw new Error('User not found.')
            }

            const orders = await OrderService.findOrdersByClient(client._id);
            res.status(200).json(orders);

        } catch (error: unknown) {
            res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
        }
    }

    static async getAllOrders(req: Request, res: Response): Promise<void> {
        try { 
            const orders = await OrderService.getAllOrders()
            res.status(200).json(orders);

        } catch (error: unknown) {
            res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
        }
    }
}

export default OrderController