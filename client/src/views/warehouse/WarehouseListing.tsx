import React, { useState, useEffect, useMemo } from "react";
import "./warehouseListing.css";
import {
  CheckOutlined,
  DownOutlined,
  EditOutlined,
  ExclamationOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { List, Result, Skeleton, Space, Image, Divider, Button } from "antd";
import { Link } from "react-router-dom";
import Search from "antd/es/input/Search";
import { useGetAllProductsQuery } from "../../features/productsApi";
import { IProduct } from "../../types/product.interface";
import { useAppSelector } from "../../hooks";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import SortSelect from "../../components/sortSection/SortSelect";

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

interface ShowDescriptionState {
  [key: string]: boolean;
}

const WarehouseListing = () => {
  const [showFullDescription, setShowFullDescription] =
    useState<ShowDescriptionState>({});

  function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }

    return text.substring(0, maxLength - 3) + "...";
  }

  const handleChange = (id: string) => {
    setShowFullDescription((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

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
      <Divider
        style={{
          borderBlockColor: "#537A5A",
        }}
      />
      {products && (
        <List
          className="products__list"
          itemLayout="vertical"
          size="large"
          pagination={{
            align: "center",
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
                description={
                  <>
                    <Divider
                      orientation="left"
                      style={{ borderColor: "#DDDDDD" }}
                    >
                      <h5>Description</h5>
                    </Divider>

                    <p className="normal-text">
                      {showFullDescription[item._id]
                        ? item.description
                        : truncateText(item.description, 200)}
                    </p>
                    <Divider
                      style={{ borderColor: "#537A5A" }}
                      orientation="right"
                    >
                      <Button
                        type="text"
                        className="link"
                        title={showFullDescription ? "show less" : "show more"}
                        onClick={() => handleChange(item._id)}
                      >
                        {showFullDescription[item._id] ? (
                          <UpOutlined />
                        ) : (
                          <DownOutlined />
                        )}
                      </Button>
                    </Divider>
                  </>
                }
              />
              <ul style={{ listStyle: "none", paddingInlineStart: 0 }}>
                <li>
                  <b>Stock quantity:</b> {item.stockQuantity}
                </li>
                <li>
                  <b>Initial stock quantiti:</b> {item.initialStockQuantity}
                </li>
                <li>
                  <b>Added at:</b>{" "}
                  {new Date(item.addedAt).toLocaleString().split(",")[0]}
                </li>
                {item.soldAt && (
                  <li>
                    <b>Last time sold at:</b>{" "}
                    {new Date(item.addedAt).toLocaleString().split(",")[0]}
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
                <li>
                  <b>SKU:</b> {item.sku}
                </li>
                {item.isAvailable ? (
                  <li className="success">
                    Available <CheckOutlined />
                  </li>
                ) : (
                  <li className="error">
                    Temporary not available <ExclamationOutlined />
                  </li>
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
