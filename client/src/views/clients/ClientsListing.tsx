import { useEffect } from "react";
import { useGetAllClientsQuery } from "../../features/clientsSlice";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import { List, Result } from "antd";
import useWindowWidth from "../../customHooks/useWindowWidth";

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
      {/* {clients && (
        <section className="employees-listing">
          <List
            itemLayout={windowWidth > 700 ? "horizontal" : "vertical"}
            loading={isLoading}
            dataSource={filteredData}
            pagination={{
              align: "center",
              pageSize: 3,
            }}
          ></List>
        </section>
      )} */}
    </>
  );
};

export default ClientsListing;
