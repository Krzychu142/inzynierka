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
import useWindowWidth from "../../customHooks/useWindowWidth";
import SortSelect from "../../components/sortSection/SortSelect";

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

  const windowWidth = useWindowWidth();

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

  const [sortOrder, setSortOrder] = useState<string | null>(null);

  const sortedData = filteredData?.sort((a: IEmployee, b: IEmployee) => {
    switch (sortOrder) {
      case "ascending":
        return a.salary - b.salary;
      case "descending":
        return b.salary - a.salary;
      case "oldest":
        return (
          new Date(a.employedAt).getTime() - new Date(b.employedAt).getTime()
        );
      case "newest":
        return (
          new Date(b.employedAt).getTime() - new Date(a.employedAt).getTime()
        );
      default:
        return 0;
    }
  });

  const sortOptions = [
    { value: "", label: "Default" },
    { value: "ascending", label: "Lowest Salary" },
    { value: "descending", label: "Highest Salary" },
    { value: "oldest", label: "Oldest Employee" },
    { value: "newest", label: "Newest Employee" },
  ];

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
          <SortSelect
            value={sortOrder ?? ""}
            onChange={setSortOrder}
            options={sortOptions}
            label="Sort:"
          />
          <section className="employees-listing">
            <List
              itemLayout={windowWidth > 900 ? "horizontal" : "vertical"}
              loading={isLoading}
              dataSource={sortedData}
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
                      description={
                        windowWidth > 400 ? (
                          <a
                            className="darker"
                            href={`mailto:${employee.email}`}
                          >
                            {employee.email}
                          </a>
                        ) : (
                          ""
                        )
                      }
                    />
                    <ul className="employees-listing__description">
                      {windowWidth < 400 && (
                        <li>
                          <a
                            href={`mailto:${employee.email}`}
                            className="main bold break-word"
                          >
                            {employee.email}
                          </a>
                        </li>
                      )}
                      <li>
                        <span className="main bold">
                          <b>Role:</b> {employee.role}
                        </span>
                      </li>
                      <li>
                        <span className="main bold">
                          <b>Salary:</b> {employee.salary}PLN
                        </span>
                      </li>
                      <li>
                        <b>Employed At: </b>
                        {
                          // split, because I do not want to display time
                          new Date(employee.employedAt)
                            .toLocaleString()
                            .split(",")[0]
                        }
                      </li>
                      <li>
                        <b>Phon number:</b> {employee.phoneNumber}
                      </li>
                      <li>
                        <b>Country:</b> {employee.country}
                      </li>
                      <li>
                        <b>City:</b> {employee.postalCode} {employee.city}
                      </li>
                      <li>
                        <b>Address:</b> {employee.address}
                      </li>
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
