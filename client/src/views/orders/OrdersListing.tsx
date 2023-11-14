import { useEffect } from "react";
import { useGetAllOrdersQuery } from "../../features/orderSlice";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import { List, Result } from "antd";
import { IOrder } from "../../types/order.interface";
import Order from "../../components/order/Order";
import "./ordersListing.css";

const OrdersListing = () => {
  const {
    data: orders,
    isLoading,
    isError,
    refetch,
  } = useGetAllOrdersQuery("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <>
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
          className="orders-list"
          loading={isLoading}
          dataSource={orders}
          pagination={{
            align: "center",
            pageSize: 2,
          }}
          itemLayout="vertical"
          renderItem={(order: IOrder) => {
            return (
              <div className="order-item">
                <Order order={order} />
              </div>
            );
          }}
        ></List>
      )}
    </>
  );
};

export default OrdersListing;
