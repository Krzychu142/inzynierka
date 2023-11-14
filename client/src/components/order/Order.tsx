import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { IOrder } from "../../types/order.interface";
import { IOrderProduct } from "../../types/orderProduct.interface";
import { ICostByCurrency } from "../../types/costByCurrency.interface";
import { List } from "antd";
import "./order.css";
import { useLocation } from "react-router-dom";
import { IClient } from "../../types/client.interface";

interface OrderProps {
  order: IOrder;
}

const Order: React.FC<OrderProps> = ({ order }) => {
  let location = useLocation();
  const [showClientInfo, setShowClientInfo] = useState(true);

  useEffect(() => {
    if (location.pathname.includes("/clients")) {
      setShowClientInfo(false);
    }
  }, [location]);

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

  const getShippingInfo = (client: IClient) => {
    let fullShippingAddress = "";

    if (client.shippingAddress) {
      fullShippingAddress = client.shippingAddress;
    } else {
      fullShippingAddress =
        client.address +
        ", " +
        client.city +
        ", " +
        client.postalCode +
        ", " +
        client.country;
    }

    return fullShippingAddress;
  };

  return (
    <List.Item key={order._id}>
      <section className="order">
        <div>
          <h2 className="main">Order id:</h2>
          <span>{order._id}</span>
        </div>
        <div>
          <h4>Ordered at:</h4>
          <span>{dayjs(order.orderDate).format("MM/DD/YYYY")}</span>
        </div>
        {showClientInfo && (
          <>
            <div className="order__client-info">
              <h4>Client:</h4>
              <span className="block">
                {order.client.name} {order.client.surname}
              </span>
              <span>{order.client.email}</span>
            </div>
            <div>
              <h4>Shipping info:</h4>
              <span>{getShippingInfo(order.client)}</span>
            </div>
          </>
        )}
        <div>
          <h4>Status:</h4>
          <b className={order.status.toLowerCase()}>
            {order.status.toUpperCase()}
          </b>
        </div>
        <h3 className="main">Products:</h3>
        {order.products.map((product, index) => {
          const key = `${order._id}-${index}`;
          return (
            <div key={key} className="order__product">
              <h4>{product.product.name}</h4>
              <span className="block">SKU: {product.product.sku}</span>
              <span className="block">
                Ordered quantity: {product.quantity}
              </span>
              <span className="block">
                Price when ordering: {product.priceAtOrder}{" "}
                {product.currencyAtOrder}
              </span>
              <span className="block">
                Cost of position: {product.quantity * product.priceAtOrder}{" "}
                {product.currencyAtOrder}
              </span>
            </div>
          );
        })}
        <div>
          <h3>Total cost:</h3> <b>{getTotalCostOfOrder(order.products)}</b>
        </div>
      </section>
    </List.Item>
  );
};

export default Order;
