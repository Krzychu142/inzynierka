import { Request, Response } from 'express'
import ErrorsHandlers from '../utils/helpers/ErrorsHandlers'
import ClientService from '../services/Client.service';
import ProductService from '../services/Product.service';
import mongoose from 'mongoose';
import OrderService from '../services/Order.service';
import { OrderStatus } from '../types/orderStatus.enum';
import ensureIdExists from '../utils/helpers/ensureIdExists';
import PdfGenerator from "../utils/pdf/PdfGenerator"
import { PdfData } from '../types/pdfData.interface';
import { PdfOrderData } from '../types/pdfORderData.interface';

interface IProductForOrder {
    productId: string,
    quantity: number
}

class OrderController {
    private static validateOrderId(req: Request) {
        if (!req.body.orderId) {
            throw new Error("Order id is missing.");
        }
    }

    private static isValidOrderStatus(status: any): status is OrderStatus {
        return Object.values(OrderStatus).includes(status);
    }


    private static aggregateProducts = (products: IProductForOrder[]) => {
        const productMap = new Map();

        for (const item of products) {
            if (productMap.has(item.productId)) {
                productMap.get(item.productId).quantity += item.quantity;
            } else {
                productMap.set(item.productId, { ...item });
            }
        }

        return Array.from(productMap.values());
    };

    static async createOrder(req: Request, res: Response): Promise<void> {
        const session = await mongoose.startSession();
        try {
            session.startTransaction(); 
            const { clientId, products, status } = req.body;

            if (!clientId) {
                throw new Error("Client email is missing.")
            }

            if (!Array.isArray(products) || products.length === 0) { 
                throw new Error("Order must have at least one item.");
            }
            
            const client = await ClientService.getSingleClient(clientId);
            if (!client) {
                throw new Error("Client not found.");
            }

            const orderProducts = [];
            const aggregatedProducts = OrderController.aggregateProducts(products);

            for (const item of aggregatedProducts) {

                const product = await ProductService.getSingleProduct(item.productId);
                if (!product) {
                    throw new Error(`Product with id: ${item.productId} was not found.`);
                }

                if (!product.isAvailable) {
                    throw new Error(`Product ${product.name} is not available.`);
                }

                if (product.stockQuantity < item.quantity) {
                    throw new Error(`Insufficient stock for product ${product.name}.`);
                }

                await ProductService.decrementProductStock(item.productId, item.quantity, session);

                const priceAtOrder = product.isOnSale && product.promotionalPrice != null
                                    ? product.promotionalPrice
                                    : product.price;

                orderProducts.push({
                    product: product._id,
                    quantity: item.quantity,
                    priceAtOrder: priceAtOrder,
                    currencyAtOrder: product.currency || "PLN"
                });
            }

            const orderDate = req.body.orderDate ? new Date(req.body.orderDate) : undefined;

            const order = await OrderService.createOrder(
                client._id,
                orderProducts,
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

    static async deleteOrder(req: Request, res: Response): Promise<void> {
        try {
            OrderController.validateOrderId(req);

            const result = OrderService.deleteOrder(req.body.orderId)
            if (!result) {
                throw new Error("Can't delete this order")
            }

            res.status(204).send(); 

        } catch (error: unknown) {
            res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
        }
    }

    static async editOrderStatus(req: Request, res: Response): Promise<void> {
        const session = await mongoose.startSession();
        try {
            session.startTransaction(); 
            OrderController.validateOrderId(req);

            const orderId = req.body.orderId;

            if (!req.body.newStatus || !OrderController.isValidOrderStatus(req.body.newStatus)) {
                throw new Error("Invalid or missing new status.");
            }

            if (req.body.newStatus === OrderStatus.CANCELED) {
                const order = await OrderService.getSingleOrder(orderId, session);
                if (!order) {
                    throw new Error("Order not found.");
                }

                for (const item of order.products) {
                    await ProductService.incrementProductStock(item.product, item.quantity, session);
                }

                await ClientService.decrementOrderCount(order.client, session)

                await OrderService.editOrderStatus(orderId, OrderStatus.CANCELED, session);
            } else {
                await OrderService.editOrderStatus(orderId, req.body.newStatus, session);
            }

            await session.commitTransaction();
            res.status(200).json({ message: "Order status updated successfully." });
        } catch (error: unknown) {
            await session.abortTransaction();
            res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
        }
        finally {
            await session.endSession();
        }
    }

    static async getOrderPdf(req: Request, res: Response): Promise<void> {
        try {
            ensureIdExists(req)

            const order = await OrderService.getFullOrderDetails(req.params.id)
            
            if (!order) {
                throw new Error(`Order with id: ${req.params.id} doesn't found.`)
            }

            const pdfData: PdfOrderData = {
                title: `Order id: ${req.params.id} Details`,
                order: order
            }

            const pdfGenerator = new PdfGenerator('Roboto-Regular');
            const pdfBuffer = await pdfGenerator.createOrderPdf(pdfData);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=order_${req.params.id}.pdf`);
            res.setHeader('Content-Length', pdfBuffer.length);

            res.end(pdfBuffer, 'binary');

        } catch (error:unknown) {
            res.status(500).json(ErrorsHandlers.errorMessageHandler(error))
        }
    }
}

export default OrderController