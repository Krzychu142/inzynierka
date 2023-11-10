import { useEffect } from "react";
import { useGetAllOrdersQuery } from "../../features/orderSlice";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import { List, Result } from "antd";

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
      {orders && <List></List>}
    </>
  );
};

export default OrdersListing;
