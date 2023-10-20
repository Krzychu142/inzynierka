import { useEffect, useState } from "react";
import { useGetAllEmployeesQuery } from "../../features/employeesApi";
import { Avatar, List, Result, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./employeesListing.css";
import { IEmployee } from "../../types/employee.interface";
import { useAppSelector } from "../../hooks";

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

  return (
    <>
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
                        <Link to="/" key="list-loadmore-more" className="link">
                          delete
                        </Link>,
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
                  <ul>
                    {windowWidth < 400 && (
                      <li>
                        <span className="main bold">{employee.email}</span>
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
