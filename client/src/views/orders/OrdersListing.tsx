import { useEffect, useState } from "react";
import { useGetAllOrdersQuery } from "../../features/orderSlice";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import { List, Result } from "antd";
import { IOrder } from "../../types/order.interface";
import Order from "../../components/order/Order";
import "./ordersListing.css";
import Search from "antd/es/input/Search";
import { useAppSelector } from "../../hooks";
import { Link } from "react-router-dom";

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

  const decodedToken = useAppSelector((state) => state.auth.decodedToken);

  const [searchValue, setSearchValue] = useState("");

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
      <section className="search-section">
        <Search
          placeholder="type name or sku"
          enterButton
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {(decodedToken?.role === "manager" ||
          decodedToken?.role === "salesman") && (
          <Link
            to="/orders/addNew"
            className="link darker search-section--add-new"
          >
            Add new
          </Link>
        )}
      </section>
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
