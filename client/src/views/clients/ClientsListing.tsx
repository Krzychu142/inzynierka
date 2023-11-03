import { useEffect } from "react";
import { useGetAllClientsQuery } from "../../features/clientsSlice";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import { Avatar, List, Result } from "antd";
import useWindowWidth from "../../customHooks/useWindowWidth";
import { IClient } from "../../types/client.interface";
import { UserOutlined } from "@ant-design/icons";
import "./clientsListing.css";
import dayjs from "dayjs";

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

  const windowWidth = useWindowWidth();

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
      {clients && (
        <section className="clients-listing">
          <List
            itemLayout={windowWidth > 700 ? "horizontal" : "vertical"}
            loading={isLoading}
            dataSource={clients}
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
                    {client.priority && (
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
