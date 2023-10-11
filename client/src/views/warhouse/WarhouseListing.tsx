import React, { useState } from "react";
import "./warhouseListing.css";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, List, Result, Skeleton, Space, Spin } from "antd";
import { Link } from "react-router-dom";
import Search from "antd/es/input/Search";
import { useGetAllProductsQuery } from "../../features/productsApi";
import { IProduct } from "../../types/product.interface";

const testData = Array.from({ length: 23 }).map((_, i) => ({
  href: "https://ant.design",
  title: `ant design part ${i}`,
  avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${i}`,
  description:
    "Ant Design, a design language for background applications, is refined by Ant UED Team.",
  content:
    "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
}));

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const WarhouseListing = () => {
  const { data: products, isLoading, isError } = useGetAllProductsQuery("");

  console.log(products);

  const [searchValue, setSearchValue] = useState("");
  const filteredData = testData.filter((item) =>
    item.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <section className="search-section">
        <Search
          placeholder="input search text"
          enterButton
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Link to="/" className="link darker search-section--add-new">
          Add new
        </Link>
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
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 3,
          }}
          dataSource={products}
          renderItem={(item: IProduct) => (
            <List.Item
              key={item.name}
              id={item._id}
              actions={[
                <Link to="/" className="link darker">
                  <IconText
                    icon={EditOutlined}
                    text="Edit"
                    key="id-list-iteam"
                  />
                </Link>,
                <Button type="link" className="link darker">
                  <IconText
                    icon={DeleteOutlined}
                    text="Delete"
                    key="id-list-iteam"
                  />
                </Button>,
              ]}
              extra={
                item.images.length > 0 ? (
                  <img
                    className="listing-logo"
                    alt="logo"
                    src={item.images[0]}
                  />
                ) : (
                  <Skeleton.Image />
                )
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
                {!item.isOnSale ? (
                  <li>
                    <b>Price:</b> ${item.price}PLN
                  </li>
                ) : (
                  <li>
                    <s>Price: ${item.price}PLN</s>
                    <br />
                    <b>Promotional price:</b> ${item.promotionalPrice}PLN
                  </li>
                )}
                {/* <li>Basic price: {item.price}PLN</li>
                {item.isOnSale && (
                  <li>
                    {item.promotionalPrice &&
                      `Promotional price: ${item.promotionalPrice}`}
                    PLN
                  </li>
                )} */}
                <li>SKU: {item.sku}</li>
                {item.isAvailable ? (
                  <li className="success">
                    <b>Available</b>
                  </li>
                ) : (
                  <li className="danger">
                    Temporary not available
                    {item.soldAt && ` since ${item.soldAt}`}
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

export default WarhouseListing;
