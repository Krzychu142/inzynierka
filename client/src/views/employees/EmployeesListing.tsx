import { useEffect, useState, useMemo } from "react";
import { useGetAllEmployeesQuery } from "../../features/employeesApi";
import { Avatar, Button, Divider, List, Result, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./employeesListing.css";
import { IEmployee, Role } from "../../types/employee.interface";
import { useAppSelector } from "../../hooks";
import axios from "axios";
import Search from "antd/es/input/Search";
import useBaseURL from "../../customHooks/useBaseURL";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import useWindowWidth from "../../customHooks/useWindowWidth";
import SortSelect from "../../components/sortSection/SortSelect";
import { ContractType } from "../../types/contractType.enum";

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
  const [contractTypeFilter, setContractTypeFilter] = useState<string | null>(
    null
  );
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  const sortedAndFilteredData = useMemo(() => {
    if (!filteredData) return [];

    let filteredByRole = filteredData;
    if (roleFilter && roleFilter !== "") {
      filteredByRole = filteredData.filter(
        (employee: IEmployee) => employee.role === roleFilter
      );
    }

    let filteredByContractType = filteredByRole;
    if (contractTypeFilter && contractTypeFilter !== "") {
      filteredByContractType = filteredByRole.filter(
        (employee: IEmployee) => employee.contractType === contractTypeFilter
      );
    }

    return filteredByContractType.sort((a: IEmployee, b: IEmployee) => {
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
  }, [filteredData, sortOrder, contractTypeFilter, roleFilter]);

  const sortOptions = [
    { value: "", label: "Default" },
    { value: "ascending", label: "Lowest Salary" },
    { value: "descending", label: "Highest Salary" },
    { value: "oldest", label: "Oldest Employee" },
    { value: "newest", label: "Newest Employee" },
  ];

  const contractTypeOptions = [
    { value: "", label: "Default" },
    { value: ContractType.EMPLOYMENTCONTRACT, label: "Employment Contract" },
    { value: ContractType.CONTRACTOFMANDATE, label: "Contract of Mandate" },
    { value: ContractType.B2B, label: "B2B" },
  ];

  const roleOptions = [
    { value: "", label: "Default" },
    { value: Role.CARTOPERATOR, label: "Cart Operator" },
    { value: Role.WAREHOUSEMAN, label: "Warehouseman" },
    { value: Role.SALESMAN, label: "Salesman" },
    { value: Role.MANAGER, label: "Manager" },
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
          </section>{" "}
          <SortSelect
            value={contractTypeFilter ?? ""}
            onChange={setContractTypeFilter}
            options={contractTypeOptions}
            label="Contract Type:"
          />
          <SortSelect
            value={roleFilter ?? ""}
            onChange={setRoleFilter}
            options={roleOptions}
            label="Role:"
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
          <section className="employees-listing">
            <List
              itemLayout={"vertical"}
              loading={isLoading}
              dataSource={sortedAndFilteredData}
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
                      title={employee.name + " " + employee.surname}
                      description={
                        <>
                          <a
                            className="darker block"
                            href={`mailto:${employee.email}`}
                          >
                            {employee.email}
                          </a>
                          <span className="darker">{employee.phoneNumber}</span>
                        </>
                      }
                    />
                    <ul className="employees-listing__description">
                      <li>
                        <span className="darker">
                          <b>Role:</b> {employee.role}
                        </span>
                      </li>
                      <li>
                        <span className="darker">
                          <b>Salary:</b> {employee.salary}
                          {employee.currency ? employee.currency : "PLN"}
                        </span>
                      </li>
                      <li>
                        <span>
                          <b>Contract type:</b> {employee.contractType}
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
