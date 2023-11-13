import React from "react";
import dayjs from "dayjs";
import { IOrder } from "../../types/order.interface";
import { IOrderProduct } from "../../types/orderProduct.interface";
import { ICostByCurrency } from "../../types/costByCurrency.interface";
import { List } from "antd";
import "./order.css";

interface OrderProps {
  order: IOrder;
}

const Order: React.FC<OrderProps> = ({ order }) => {
  const getTotalCostOfOrder = (products: IOrderProduct[]): string => {
    const costByCurrency = products.reduce((acc: ICostByCurrency, product) => {
      const { currencyAtOrder, priceAtOrder, quantity } = product;
      if (!acc[currencyAtOrder]) {
        acc[currencyAtOrder] = 0;
      }
      acc[currencyAtOrder] += priceAtOrder * quantity;
      return acc;
    }, {} as ICostByCurrency);

    const totalCostString = Object.entries(costByCurrency)
      .map(([currency, total]) => `${total.toFixed(2)} ${currency}`)
      .join(", ");

    return totalCostString;
  };

  return (
    <List.Item key={order._id}>
      <h3>Order id:</h3>
      <span>{order._id}</span>
      <h4>Ordered at:</h4>
      <span>{dayjs(order.orderDate).format("MM/DD/YYYY")}</span>
      <h4>Status:</h4>
      <b>{order.status}</b>
      <h4>Products:</h4>
      {order.products.map((product, index) => {
        const key = `${order._id}-${index}`;
        return (
          <div key={key}>
            <h4>{product.product.name}</h4>
            <span className="block">SKU: {product.product.sku}</span>
            <span className="block">Ordered quantity: {product.quantity}</span>
            <span className="block">
              Price in order: {product.priceAtOrder} {product.currencyAtOrder}
            </span>
            <span className="block">
              Cost of product: {product.quantity * product.priceAtOrder}{" "}
              {product.currencyAtOrder}
            </span>
          </div>
        );
      })}
      <h4>Total cost: {getTotalCostOfOrder(order.products)}</h4>
    </List.Item>
  );
};

export default Order;
