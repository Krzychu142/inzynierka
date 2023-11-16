import React, { useState, useEffect, useMemo } from "react";
import "./warehouseListing.css";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, List, Result, Skeleton, Space, message, Image } from "antd";
import { Link } from "react-router-dom";
import Search from "antd/es/input/Search";
import { useGetAllProductsQuery } from "../../features/productsApi";
import { IProduct } from "../../types/product.interface";
import { useAppSelector } from "../../hooks";
// import axios from "axios";
// import useBaseURL from "../../customHooks/useBaseURL";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import SortSelect from "../../components/sortSection/SortSelect";

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const WarehouseListing = () => {
  // const baseUrl = useBaseURL();
  // const [messageApi, contextHolder] = message.useMessage();

  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useGetAllProductsQuery("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const decodedToken = useAppSelector((state) => state.auth.decodedToken);

  const [searchValue, setSearchValue] = useState("");
  const filteredData = products?.filter(
    (item: IProduct) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.description.toLowerCase().includes(searchValue.toLowerCase())
  );

  // const token = useAppSelector((state) => state.auth.token);

  // const deleteProduct = (id: string) => {
  //   axios
  //     .delete(`${baseUrl}products/delete`, {
  //       data: { id },
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((res) => {
  //       if (res.status) {
  //         refetch();
  //       }
  //     })
  //     .catch((err) => {
  //       messageApi.open({
  //         type: "error",
  //         content:
  //           err.response && err.response.data.message
  //             ? err.response.data.message
  //             : "Something goes wrong",
  //       });
  //     });
  // };

  const [sortOrder, setSortOrder] = useState<string | null>(null);

  const sortOptions = [
    { value: "", label: "Default" },
    { value: "price_asc", label: "Lowest Price" },
    { value: "price_desc", label: "Highest Price" },
    { value: "quantity_asc", label: "Lowest Quantity" },
    { value: "quantity_desc", label: "Highest Quantity" },
    { value: "addedAt_asc", label: "Oldest Added" },
    { value: "addedAt_desc", label: "Newest Added" },
  ];

  const [availabilitySort, setAvailabilitySort] = useState<string | null>(null);

  const availabilityOptions = [
    { value: "", label: "Default" },
    { value: "available", label: "Available" },
    { value: "unavailable", label: "Unavailable" },
  ];

  const sortedData = useMemo(() => {
    let filteredByAvailability = filteredData;
    if (availabilitySort === "available") {
      filteredByAvailability = filteredData.filter(
        (a: IProduct) => a.isAvailable
      );
    } else if (availabilitySort === "unavailable") {
      filteredByAvailability = filteredData.filter(
        (a: IProduct) => !a.isAvailable
      );
    }

    if (sortOrder) {
      filteredByAvailability.sort((a: IProduct, b: IProduct) => {
        switch (sortOrder) {
          case "price_asc":
            return a.price - b.price;
          case "price_desc":
            return b.price - a.price;
          case "quantity_asc":
            return a.stockQuantity - b.stockQuantity;
          case "quantity_desc":
            return b.stockQuantity - a.stockQuantity;
          case "addedAt_asc":
            return (
              new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
            );
          case "addedAt_desc":
            return (
              new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
            );
          default:
            return 0;
        }
      });
    }

    return filteredByAvailability;
  }, [filteredData, sortOrder, availabilitySort]);

  return (
    <>
      {/* {contextHolder} */}
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
        {decodedToken?.role != "cart operator" && (
          <Link
            to="/warehouse/addNew"
            className="link darker search-section--add-new"
          >
            Add new
          </Link>
        )}
      </section>
      <SortSelect
        value={availabilitySort ?? ""}
        onChange={setAvailabilitySort}
        options={availabilityOptions}
        label="Availability:"
      />
      <SortSelect
        value={sortOrder ?? ""}
        onChange={setSortOrder}
        options={sortOptions}
        label="Sort:"
      />
      {products && (
        <List
          className="products__list"
          itemLayout="vertical"
          size="large"
          pagination={{
            align: "center",
            // can be usefull later
            // onChange: (page) => {
            //   console.log(page);
            // },
            pageSize: 2,
          }}
          dataSource={sortedData}
          renderItem={(item: IProduct) => (
            <List.Item
              key={item.name}
              id={item._id}
              actions={[
                ...(decodedToken?.role !== "cart operator"
                  ? [
                      <Link
                        to={`/warehouse/${item._id}`}
                        className="link darker"
                      >
                        <IconText
                          icon={EditOutlined}
                          text="Edit"
                          key="id-list-iteam"
                        />
                      </Link>,
                      // <Button
                      //   type="link"
                      //   className="link darker"
                      //   onClick={() => deleteProduct(item._id)}
                      // >
                      //   <IconText
                      //     icon={DeleteOutlined}
                      //     text="Delete"
                      //     key="id-list-iteam"
                      //   />
                      // </Button>,
                    ]
                  : []),
              ]}
              extra={
                <section className="section__logo">
                  {item.images.length > 0 ? (
                    <Image.PreviewGroup items={item.images}>
                      <Image className="listing-logo" src={item.images[0]} />
                    </Image.PreviewGroup>
                  ) : (
                    <Skeleton.Image className="listing-logo" />
                  )}
                </section>
              }
            >
              <List.Item.Meta
                title={item.name}
                description={item.description}
              />
              <ul>
                <li>
                  <b>Stock quantity:</b> {item.stockQuantity}
                </li>
                <li>Initial stock quantiti: {item.initialStockQuantity}</li>
                <li>
                  Added at:{" "}
                  {new Date(item.addedAt).toLocaleString().split(",")[0]}
                </li>
                {item.soldAt && (
                  <li>
                    Last time sold at: {new Date(item.soldAt).toLocaleString()}
                  </li>
                )}
                {!item.isOnSale ? (
                  <li>
                    <b>Price:</b> {item.price}
                    {item.currency}
                  </li>
                ) : (
                  <li>
                    <s>
                      Price: {item.price}
                      {item.currency}
                    </s>
                    <br />
                    <b>Promotional price:</b> {item.promotionalPrice}
                    {item.currency}
                  </li>
                )}
                <li>SKU: {item.sku}</li>
                {item.isAvailable ? (
                  <li className="success">
                    <b>Available</b>
                  </li>
                ) : (
                  <li className="error">Temporary not available</li>
                )}
              </ul>
            </List.Item>
          )}
        />
      )}
    </>
  );
};

export default WarehouseListing;
