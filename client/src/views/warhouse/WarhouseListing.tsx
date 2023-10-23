import React, { useState, useEffect } from "react";
import "./warhouseListing.css";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, List, Result, Skeleton, Space, Spin, message } from "antd";
import { Link } from "react-router-dom";
import Search from "antd/es/input/Search";
import { useGetAllProductsQuery } from "../../features/productsApi";
import { IProduct } from "../../types/product.interface";
import { useAppSelector } from "../../hooks";
import axios from "axios";
import useBaseURL from "../../customHooks/useBaseURL";

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const WarhouseListing = () => {
  const baseUrl = useBaseURL();
  const [messageApi, contextHolder] = message.useMessage();

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

  const token = useAppSelector((state) => state.auth.token);

  const deleteProduct = (id: string) => {
    axios
      .delete(`${baseUrl}products/delete`, {
        data: { id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status) {
          refetch();
        }
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content:
            err.response && err.response.data.message
              ? err.response.data.message
              : "Something goes wrong",
        });
      });
  };

  return (
    <>
      {contextHolder}
      <section className="search-section">
        <Search
          placeholder="input search text"
          enterButton
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {decodedToken?.role != "cart operator" && (
          <Link
            to="/warhouse/addNew"
            className="link darker search-section--add-new"
          >
            Add new
          </Link>
        )}
      </section>
      {isLoading && (
        <Spin tip="Loading" size="large">
          <div />
        </Spin>
      )}
      {isError && (
        <Result
          status="error"
          title="Somthing goes wrong"
          subTitle="Please try later"
        ></Result>
      )}
      {products && (
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            align: "center",
            // can be usefull later
            // onChange: (page) => {
            //   console.log(page);
            // },
            pageSize: 3,
          }}
          dataSource={filteredData}
          renderItem={(item: IProduct) => (
            <List.Item
              key={item.name}
              id={item._id}
              actions={[
                ...(decodedToken?.role !== "cart operator"
                  ? [
                      <Link
                        to={`/warhouse/${item._id}`}
                        className="link darker"
                      >
                        <IconText
                          icon={EditOutlined}
                          text="Edit"
                          key="id-list-iteam"
                        />
                      </Link>,
                      <Button
                        type="link"
                        className="link darker"
                        onClick={() => deleteProduct(item._id)}
                      >
                        <IconText
                          icon={DeleteOutlined}
                          text="Delete"
                          key="id-list-iteam"
                        />
                      </Button>,
                    ]
                  : []),
              ]}
              extra={
                <section className="section__logo">
                  {item.images.length > 0 ? (
                    <img
                      className="listing-logo"
                      alt={item.description}
                      src={item.images[0]}
                    />
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
                <li>Added at: {new Date(item.addedAt).toLocaleString()}</li>
                {item.soldAt && (
                  <li>
                    Last time sold at: {new Date(item.soldAt).toLocaleString()}
                  </li>
                )}
                {!item.isOnSale ? (
                  <li>
                    <b>Price:</b> {item.price}PLN
                  </li>
                ) : (
                  <li>
                    <s>Price: {item.price}PLN</s>
                    <br />
                    <b>Promotional price:</b> {item.promotionalPrice}PLN
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

export default WarhouseListing;
