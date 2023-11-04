import { useEffect, useState } from "react";
import { useGetAllClientsQuery } from "../../features/clientsSlice";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import { Avatar, List, Result } from "antd";
import useWindowWidth from "../../customHooks/useWindowWidth";
import { IClient } from "../../types/client.interface";
import { UserOutlined } from "@ant-design/icons";
import "./clientsListing.css";
import dayjs from "dayjs";
import Search from "antd/es/input/Search";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks";

const ClientsListing = () => {
  const {
    data: clients,
    isLoading,
    isError,
    refetch,
  } = useGetAllClientsQuery("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const decodedToken = useAppSelector((store) => store.auth.decodedToken);

  const windowWidth = useWindowWidth();
  const [searchValue, setSearchValue] = useState("");
  const filteredData = clients?.filter(
    (item: IClient) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.surname.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.email.toLowerCase().includes(searchValue.toLowerCase())
  );

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
          placeholder="type name, surname, email or role"
          enterButton
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {(decodedToken?.role === "manager" ||
          decodedToken?.role === "salesman") && (
          <Link
            to="/clients/addNew"
            className="link darker search-section--add-new"
          >
            Add new
          </Link>
        )}
      </section>
      {clients && (
        <section className="clients-listing">
          <List
            itemLayout={windowWidth > 700 ? "horizontal" : "vertical"}
            loading={isLoading}
            dataSource={filteredData}
            pagination={{
              align: "center",
              pageSize: 3,
            }}
            renderItem={(client: IClient) => {
              return (
                <List.Item key={client._id}>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={64}
                        shape="square"
                        icon={<UserOutlined />}
                      />
                    }
                    title={client.name + " " + client.surname}
                    description={
                      <span>
                        Priority: <b>{client.priority}</b>
                      </span>
                    }
                  />
                  <ul className="clients-listing__list">
                    <li>
                      <b className="break-word">{client.email}</b>
                    </li>
                    {client.description && (
                      <li>
                        <p className="client__description">
                          {client.description}
                        </p>
                      </li>
                    )}
                    <li>
                      Added at: {dayjs(client.addedAt).format("DD.MM.YYYY")}
                    </li>
                    {/* maybe here how many orders for this client, end his last order or click to generate his all orders? */}
                    {client.regular && (
                      <li>
                        <b className="darker">Regular client</b>
                      </li>
                    )}
                    <li>Phon number: {client.phoneNumber}</li>
                    <li>
                      Address: {client.country} {client.city}{" "}
                      {client.postalCode}
                    </li>
                    {client.shippingAddress && (
                      <li>Shipping address: {client.shippingAddress}</li>
                    )}
                  </ul>
                </List.Item>
              );
            }}
          ></List>
        </section>
      )}
    </>
  );
};

export default ClientsListing;
