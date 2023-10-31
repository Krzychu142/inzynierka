import { useEffect, useState } from "react";
import { useGetAllEmployeesQuery } from "../../features/employeesApi";
import { Avatar, Button, List, Result, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./employeesListing.css";
import { IEmployee } from "../../types/employee.interface";
import { useAppSelector } from "../../hooks";
import axios from "axios";
import Search from "antd/es/input/Search";
import useBaseURL from "../../customHooks/useBaseURL";
import LoadingSpinner from "../../components/loading/LoadingSpinner";

const EmployeesListing = () => {
  const decodedToken = useAppSelector((store) => store.auth.decodedToken);

  const {
    data: employees,
    isLoading,
    isError,
    refetch,
  } = useGetAllEmployeesQuery("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [windowWidth]);

  const baseUrl = useBaseURL();

  const token = useAppSelector((state) => state.auth.token);

  const [messageApi, contextHolder] = message.useMessage();

  const deleteEmployee = (email: string) => {
    axios
      .delete(`${baseUrl}employees/delete`, {
        data: { email },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status) {
          refetch();
          if (res.status === 201) {
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

  const [searchValue, setSearchValue] = useState("");
  const filteredData = employees?.filter(
    (item: IEmployee) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.surname.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.role.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      {contextHolder}
      {isError && (
        <Result
          status="error"
          title="Somthing goes wrong"
          subTitle="Please try later"
        ></Result>
      )}
      {isLoading && <LoadingSpinner />}
      {employees && (
        <>
          <section className="search-section">
            <Search
              placeholder="type name, surname, email or role"
              enterButton
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {decodedToken?.role === "manager" && (
              <Link
                to="/employees/addNew"
                className="link darker search-section--add-new"
              >
                Add new
              </Link>
            )}
          </section>
          <section className="employees-listing">
            <List
              itemLayout={windowWidth > 700 ? "horizontal" : "vertical"}
              loading={isLoading}
              dataSource={filteredData}
              pagination={{
                align: "center",
                pageSize: 3,
              }}
              renderItem={(employee: IEmployee) => (
                <List.Item
                  // only manager can delete or edit employee
                  actions={
                    decodedToken?.role === "manager"
                      ? [
                          <Link
                            to={`/employees/${employee._id}`}
                            key="list-loadmore-edit"
                            className="link darker"
                            // style={
                            //   decodedToken.email === employee.email
                            //     ? {
                            //         opacity: 0.5,
                            //         pointerEvents: "none",
                            //       }
                            //     : {}
                            // }
                          >
                            Edit
                          </Link>,
                          <Button
                            type="link"
                            key="list-loadmore-more"
                            className="link darker"
                            onClick={() => {
                              deleteEmployee(employee.email);
                            }}
                            disabled={decodedToken.email === employee.email}
                          >
                            Delete
                          </Button>,
                        ]
                      : []
                  }
                >
                  <>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          size={64}
                          shape="square"
                          icon={<UserOutlined />}
                        />
                      }
                      title={employee.name + " " + employee.surname}
                      description={windowWidth > 400 ? employee.email : ""}
                    />
                    <ul className="employees-listing__description">
                      {windowWidth < 400 && (
                        <li>
                          <span className="main bold break-word">
                            {employee.email}
                          </span>
                        </li>
                      )}
                      <li>
                        <span className="main bold">Role: {employee.role}</span>
                      </li>
                      <li>
                        <span className="main bold">
                          Salary: {employee.salary}PLN
                        </span>
                      </li>
                      <li>
                        Employed At:{" "}
                        {
                          // split, because I do not want to display time
                          new Date(employee.employedAt)
                            .toLocaleString()
                            .split(",")[0]
                        }
                      </li>
                      <li>Phon number: {employee.phoneNumber}</li>
                      <li>Country: {employee.country}</li>
                      <li>
                        City: {employee.postalCode} {employee.city}
                      </li>
                      <li>Address: {employee.address}</li>
                    </ul>
                  </>
                </List.Item>
              )}
            />
          </section>
        </>
      )}
    </>
  );
};

export default EmployeesListing;
