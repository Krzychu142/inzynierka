import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetOrdersByClientQuery } from "../../features/orderSlice";
import { List, Result } from "antd";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import { IOrder } from "../../types/order.interface";
import './singleClientOrders.css'

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
            <List.Item>
              <h4>Order id:</h4>
              <span>{order._id}</span>
              <h5>Status:</h5>
              <b>{order.status}</b>
              <h5>Products:</h5>
              {order.products.map((product) => {
                return (
                  <div>
                  <h6>{product.name}</h6></div>
                )
              })}
            </List.Item>
          )
        }}
        >
        </List>
      )}
    </div>
  );
};

export default SingleClientOrders;
