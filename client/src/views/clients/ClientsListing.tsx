import { useEffect, useState, useMemo } from "react";
import { useGetAllClientsQuery } from "../../features/clientsSlice";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import { Avatar, Button, Divider, List, Modal, Result, message } from "antd";
import useWindowWidth from "../../customHooks/useWindowWidth";
import { IClient } from "../../types/client.interface";
import { UserOutlined, WarningOutlined } from "@ant-design/icons";
import "./clientsListing.css";
import Search from "antd/es/input/Search";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import axios from "axios";
import useBaseURL from "../../customHooks/useBaseURL";
import SortSelect from "../../components/sortSection/SortSelect";

const ClientsListing = () => {
  //TODO: function to generate orders summary for this client

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
  const [selectedPriority, setSelectedPriority] = useState("");

  const filteredData = useMemo(() => {
    if (!clients) return [];

    return clients.filter((client: IClient) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        client.surname.toLowerCase().includes(searchValue.toLowerCase()) ||
        client.email.toLowerCase().includes(searchValue.toLowerCase());
      const matchesPriority = selectedPriority
        ? client.priority === selectedPriority
        : true;
      return matchesSearch && matchesPriority;
    });
  }, [clients, searchValue, selectedPriority]);

  const [messageApi, contextHolder] = message.useMessage();

  const baseUrl = useBaseURL();

  const token = useAppSelector((state) => state.auth.token);

  const [open, setOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  const showDeleteModal = (clientId: string) => {
    setOpen(true);
    setClientToDelete(clientId);
  };

  const deleteClient = () => {
    axios
      .delete(`${baseUrl}clients/delete`, {
        data: { clientId: clientToDelete },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status) {
          refetch();
          if (res.status === 201) {
            setOpen(false);
            messageApi.open({
              type: "success",
              content: res.data?.message,
            });
          }
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

  const [sortOrder, setSortOrder] = useState<string | null>(null);

  const sortOptions = [
    { value: "", label: "Default" },
    { value: "ascending", label: "Fewest Orders" },
    { value: "descending", label: "Most Orders" },
    { value: "oldest", label: "Oldest First" },
    { value: "newest", label: "Newest First" },
  ];

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a: IClient, b: IClient) => {
      switch (sortOrder) {
        case "ascending":
          return a.countOfOrder - b.countOfOrder;
        case "descending":
          return b.countOfOrder - a.countOfOrder;
        case "oldest":
          return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
        case "newest":
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        default:
          return 0;
      }
    });
  }, [filteredData, sortOrder]);

  const priorityOptions = [
    { value: "", label: "Default" },
    { value: "vip", label: "VIP" },
    { value: "important", label: "Important" },
    { value: "normal", label: "Normal" },
    { value: "low priority", label: "Low Priority" },
  ];

  return (
    <>
      {contextHolder}
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
          placeholder="type name, surname, email"
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
      <SortSelect
        value={selectedPriority ?? ""}
        onChange={setSelectedPriority}
        options={priorityOptions}
        label="Priority:"
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
      {clients && (
        <section className="clients-listing">
          <Modal
            title={
              <span>
                <WarningOutlined />
                Be careful!
              </span>
            }
            open={open}
            okText="Confirm"
            onOk={deleteClient}
            onCancel={() => setOpen(false)}
          >
            <p>Deleting a customer will also delete all their orders!</p>
          </Modal>
          <List
            itemLayout={windowWidth > 850 ? "horizontal" : "vertical"}
            loading={isLoading}
            dataSource={sortedData}
            pagination={{
              align: "center",
              pageSize: 3,
            }}
            renderItem={(client: IClient) => {
              let actions = [];

              if (
                decodedToken?.role === "manager" ||
                decodedToken?.role === "salesman"
              ) {
                actions.push(
                  <Link
                    to={`/clients/${client._id}`}
                    key="list-loadmore-edit"
                    className="link darker action-element"
                  >
                    Edit
                  </Link>,
                  <Button
                    type="link"
                    key="list-loadmore-delete"
                    className="link darker action-element"
                    style={{ padding: "0" }}
                    onClick={() => {
                      showDeleteModal(client._id);
                    }}
                    disabled={decodedToken.email === client.email}
                  >
                    Delete
                  </Button>,
                  <Link
                    to={`/clients/orders/${btoa(client.email)}`}
                    key="list-loadmore-orders"
                    className="link darker action-element"
                    title={`Orders: ${client.countOfOrder}`}
                  >
                    Orders
                  </Link>
                );
              }
              return (
                <List.Item actions={actions} key={client._id}>
                  <List.Item.Meta
                    avatar={
                      windowWidth > 400 ? (
                        <Avatar
                          size={64}
                          shape="square"
                          icon={<UserOutlined />}
                        />
                      ) : (
                        ""
                      )
                    }
                    title={client.name + " " + client.surname}
                    description={
                      <>
                        <a
                          href={`mailto:${client.email}`}
                          className="block darker break-word"
                        >
                          {client.email}
                        </a>
                        <span className="block darker">
                          {client.phoneNumber}
                        </span>
                        {client.description && (
                          <Divider orientation="left" orientationMargin="0">
                            <span>Notes:</span>
                          </Divider>
                        )}
                        <p className="normal-text">{client.description}</p>
                      </>
                    }
                  />
                  <ul className="clients-listing__list">
                    <li>
                      <b className="normal-text">Priority: </b>
                      <b className={client.priority}>
                        {client.priority.toUpperCase()}
                      </b>
                    </li>
                    {client.regular && (
                      <li>
                        <b
                          className="darker"
                          style={{ textTransform: "uppercase" }}
                        >
                          Regular
                        </b>
                      </li>
                    )}
                    <li>
                      <b>Added at: </b>
                      {new Date(client.addedAt).toLocaleString().split(",")[0]}
                    </li>
                    <li>
                      <b>Address:</b> {client.country} {client.city}{" "}
                      {client.postalCode}
                    </li>
                    {client.shippingAddress && (
                      <li>
                        <b>Shipping address:</b> {client.shippingAddress}
                      </li>
                    )}
                    <li>
                      <b>Orders placed:</b> {client.countOfOrder}
                    </li>
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
