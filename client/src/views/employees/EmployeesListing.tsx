import { useEffect, useState } from "react";
import { useGetAllEmployeesQuery } from "../../features/employeesApi";
import { Avatar, Button, List, Result, Spin, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./employeesListing.css";
import { IEmployee } from "../../types/employee.interface";
import { useAppSelector } from "../../hooks";
import axios from "axios";

const EmployeesListing = () => {
  // TODO: It can be moved to custom hook
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

  // TODO: move this to global function to not repeat
  let baseUrl = import.meta.env.VITE_BASE_BACKEND_URL;

  if (!baseUrl) {
    baseUrl = "http://localhost:3001/";
  }

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
      {isLoading && (
        <Spin tip="Loading" size="large">
          <div />
        </Spin>
      )}
      {employees && (
        <section className="employees-listing">
          <List
            itemLayout={windowWidth > 700 ? "horizontal" : "vertical"}
            loading={isLoading}
            dataSource={employees}
            renderItem={(employee: IEmployee) => (
              <List.Item
                // only manager can delete or edit employee
                actions={
                  decodedToken?.role === "manager"
                    ? [
                        <Link to="/" key="list-loadmore-edit" className="link">
                          edit
                        </Link>,
                        <Button
                          type="link"
                          key="list-loadmore-more"
                          className="link"
                          onClick={() => {
                            deleteEmployee(employee.email);
                          }}
                          disabled={decodedToken.email === employee.email}
                        >
                          delete
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
                        <span className="main bold email">
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
      )}
    </>
  );
};

export default EmployeesListing;
