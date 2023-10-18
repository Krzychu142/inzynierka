import { useEffect } from "react";
import { useGetAllEmployeesQuery } from "../../features/employeesApi";
import { Result, Spin } from "antd";

const EmployeesListing = () => {
  const {
    data: employees,
    isLoading,
    isError,
    refetch,
  } = useGetAllEmployeesQuery("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div>
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
      {employees &&
        employees.map((employee: any) => {
          return <h1>{employee.name}</h1>;
        })}
    </div>
  );
};

export default EmployeesListing;
