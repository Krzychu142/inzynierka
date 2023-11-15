import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { IOrder, OrderStatus } from "../../types/order.interface";
import { IOrderProduct } from "../../types/orderProduct.interface";
import { ICostByCurrency } from "../../types/costByCurrency.interface";
import { Button, List, Modal, message } from "antd";
import "./order.css";
import { useLocation } from "react-router-dom";
import { IClient } from "../../types/client.interface";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import axios from "axios";
import useBaseURL from "../../customHooks/useBaseURL";
import { useAppSelector } from "../../hooks";
import { useGetAllOrdersQuery } from "../../features/orderSlice";

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

  const [messageApi, contextHolder] = message.useMessage();
  const baseUrl = useBaseURL();
  const token = useAppSelector((state) => state.auth.token);
  const decodedToken = useAppSelector((state) => state.auth.decodedToken);
  const { refetch } = useGetAllOrdersQuery("");

  const deleteOrder = (orderId: string) => {
    axios
      .delete(`${baseUrl}orders/delete`, {
        data: { orderId: orderId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        refetch();
        messageApi.open({
          type: "success",
          content: "Order deleted successfully!",
        });
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content:
            err.response && err.response.data.message
              ? err.response.data.message
              : "Something goes wrong",
        });
      });
  };

  const changeOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    axios
      .put(
        `${baseUrl}orders/changeStatus`,
        { orderId, newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        refetch();
        messageApi.open({
          type: "success",
          content: res.data.message || "Order edited successfully",
        });
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content:
            err.response && err.response.data.message
              ? err.response.data.message
              : "Something goes wrong",
        });
      });
  };

  const [open, setOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

  const showCancelModal = (orderId: string) => {
    setOpen(true);
    setOrderToCancel(orderId);
  };

  const handleConfirmCancel = () => {
    if (orderToCancel) {
      changeOrderStatus(orderToCancel, OrderStatus.CANCELED);
      setOpen(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={
          <span>
            <WarningOutlined />
            Be careful!
          </span>
        }
        open={open}
        okText="Confirm"
        onOk={handleConfirmCancel}
        onCancel={() => setOpen(false)}
      >
        <p>Canceling an order will undo all items.</p>
      </Modal>
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
                <a href={`mailto:${order.client.email}`} className="darker">
                  {order.client.email}
                </a>
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
          <div className="order__products-grid">
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
          </div>
          <div>
            <h3>Total cost:</h3> <b>{getTotalCostOfOrder(order.products)}</b>
          </div>
          {(decodedToken?.role === "manager" ||
            decodedToken?.role === "salesman") && (
            <div className="order__actions">
              <Button type="primary" onClick={() => deleteOrder(order._id)}>
                <DeleteOutlined />
                Delete
              </Button>
              <Button type="primary">
                <DownloadOutlined />
                PDF
              </Button>
            </div>
          )}
          {order.status === "pending" && (
            <div className="order__actions">
              <Button onClick={() => showCancelModal(order._id)}>
                <CloseOutlined />
                Cancel
              </Button>
              <Button
                onClick={() =>
                  changeOrderStatus(order._id, OrderStatus.COMPLETED)
                }
              >
                <CheckOutlined />
                Complete
              </Button>
            </div>
          )}
        </section>
      </List.Item>
    </>
  );
};

export default Order;
