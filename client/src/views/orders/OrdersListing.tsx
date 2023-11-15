import { useEffect, useMemo, useState } from "react";
import { useGetAllOrdersQuery } from "../../features/orderSlice";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import { List, Result } from "antd";
import { IOrder } from "../../types/order.interface";
import Order from "../../components/order/Order";
import "./ordersListing.css";
import Search from "antd/es/input/Search";
import { useAppSelector } from "../../hooks";
import { Link } from "react-router-dom";
import SortSelect from "../../components/sortSection/SortSelect";

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
  const filteredData = orders?.filter((order: IOrder) => {
    const searchLower = searchValue.toLowerCase();

    const isClientMatch =
      order.client.name.toLowerCase().includes(searchLower) ||
      order.client.surname.toLowerCase().includes(searchLower);

    const isProductMatch = order.products.some(
      (product) =>
        product.product.name.toLowerCase().includes(searchLower) ||
        product.product.sku.toLowerCase().includes(searchLower)
    );

    return isClientMatch || isProductMatch;
  });

  const getTotalOrderAmount = (order: IOrder): number => {
    return order.products.reduce((total, product) => {
      return total + product.priceAtOrder * product.quantity;
    }, 0);
  };

  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const [statusSort, setStatusSort] = useState<string | null>(null);

  const sortOrderOptions = [
    { value: "", label: "Default" },
    { value: "total_high", label: "Highest Total" },
    { value: "total_low", label: "Lowest Total" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ];

  const statusSortOptions = [
    { value: "", label: "Default" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "canceled", label: "Canceled" },
  ];

  const sortedData = useMemo(() => {
    let data = [...(filteredData || [])];

    if (statusSort) {
      data = data.filter((order) => order.status === statusSort);
    }

    if (sortOrder) {
      data.sort((a, b) => {
        switch (sortOrder) {
          case "total_high":
            return getTotalOrderAmount(b) - getTotalOrderAmount(a);
          case "total_low":
            return getTotalOrderAmount(a) - getTotalOrderAmount(b);
          case "newest":
            return (
              new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
            );
          case "oldest":
            return (
              new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
            );
          default:
            return 0;
        }
      });
    }

    return data;
  }, [filteredData, sortOrder, statusSort]);

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
          placeholder="search by client name, surname, products name or sku"
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
      <SortSelect
        value={statusSort ?? ""}
        onChange={setStatusSort}
        options={statusSortOptions}
        label="Status:"
      />
      <SortSelect
        value={sortOrder ?? ""}
        onChange={setSortOrder}
        options={sortOrderOptions}
        label="Sort:"
      />
      {orders && (
        <List
          className="orders-list"
          loading={isLoading}
          dataSource={sortedData}
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
