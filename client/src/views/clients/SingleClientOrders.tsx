import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetOrdersByClientQuery } from "../../features/orderSlice";
import { List, Result } from "antd";
import LoadingSpinner from "../../components/loading/LoadingSpinner";

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
        <List loading={isLoading} dataSource={orders}>
          <List.Item></List.Item>
        </List>
      )}
    </>
  );
};

export default SingleClientOrders;
