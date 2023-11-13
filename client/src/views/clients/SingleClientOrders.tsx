import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetOrdersByClientQuery } from "../../features/orderSlice";
import { List, Result } from "antd";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import { IOrder } from "../../types/order.interface";
import "./singleClientOrders.css";
import Order from "../../components/order/Order";

const SingleClientOrders = () => {
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

  return (
    <section className="single-client-orders-container">
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
            return <Order order={order} />;
          }}
        ></List>
      )}
    </section>
  );
};

export default SingleClientOrders;
