import React, { useState } from "react";
import "./warhouseListing.css";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, List, Space } from "antd";
import { Link } from "react-router-dom";
import Search from "antd/es/input/Search";

const data = Array.from({ length: 23 }).map((_, i) => ({
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
  const [searchValue, setSearchValue] = useState("");
  const filteredData = data.filter((item) =>
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
        dataSource={filteredData}
        // footer={
        //   <footer className="listing__footer">
        //     <Link to="/" className="link darker listing__footer--add-new">
        //       Add new
        //     </Link>
        //   </footer>
        // }
        renderItem={(item) => (
          <List.Item
            key={item.title}
            actions={[
              <Link to="/" className="link darker">
                <IconText icon={EditOutlined} text="Edit" key="id-list-iteam" />
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
              <img
                className="listing-logo"
                width={272}
                alt="logo"
                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
              />
            }
          >
            <List.Item.Meta title={item.title} description={item.description} />
            {item.content}
          </List.Item>
        )}
      />
    </>
  );
};

export default WarhouseListing;
