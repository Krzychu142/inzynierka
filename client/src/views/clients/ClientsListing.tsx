import { useEffect } from "react";
import { useGetAllClientsQuery } from "../../features/clientsSlice";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import { Result } from "antd";

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

  console.log(clients, "clients");

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
      {clients && <p>there will be list of clients</p>}
    </>
  );
};

export default ClientsListing;
