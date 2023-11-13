import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetOrdersByClientQuery } from "../../features/orderSlice";
import { List, Result } from "antd";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import { IOrder } from "../../types/order.interface";
import "./singleClientOrders.css";
import dayjs from "dayjs";
import { IOrderProduct } from "../../types/orderProduct.interface";

const SingleClientOrders = () => {
  //TODO: add some state for currency??? mayby global?
  const { email } = useParams();

  const {
    data: orders,
    isLoading,
    isError,
    refetch,
  } = useGetOrdersByClientQuery(email && atob(email));

  useEffect(() => {
    refetch();
  }, [refetch]);

  const getTotalCostOfOrder = (products: IOrderProduct[]): string => {
    // reduce instead of forEach to get better performance
    const totalCost = products.reduce((total, product) => {
      return total + product.quantity * product.priceAtOrder;
    }, 0);

    return totalCost.toFixed(2) + " PLN";
  };

  //TODO: maybe some brutto netto????

  console.log(orders);

  return (
    <div className="single-client-orders-container">
      {isLoading && <LoadingSpinner />}
      {isError && (
        <Result
          status="error"
          title="Somthing goes wrong"
          subTitle="Please try later"
        ></Result>
      )}
      {orders && (
        <List
          loading={isLoading}
          dataSource={orders}
          pagination={{
            align: "center",
            pageSize: 2,
          }}
          itemLayout={"vertical"}
          renderItem={(order: IOrder) => {
            return (
              <List.Item key={order._id}>
                <h3>Order id:</h3>
                <span>{order._id}</span>
                <h4>Placed at:</h4>
                <span>{dayjs(order.orderDate).format("DD-MM-YYYY")}</span>
                <h4>Status:</h4>
                <b>{order.status}</b>
                <h4>Products:</h4>
                {order.products.map((product, index) => {
                  const key = `${order._id}-${index}`;
                  return (
                    <div key={key}>
                      <h4>{product.product.name}</h4>
                      <span className="block">
                        Quantity: {product.quantity}
                      </span>
                      <span className="block">
                        Price in order: {product.priceAtOrder} PLN
                      </span>
                      <span className="block">
                        Cost of product:{" "}
                        {product.quantity * product.priceAtOrder} PLN
                      </span>
                    </div>
                  );
                })}
                <h4>Total cost: {getTotalCostOfOrder(order.products)}</h4>
              </List.Item>
            );
          }}
        ></List>
      )}
    </div>
  );
};

export default SingleClientOrders;
