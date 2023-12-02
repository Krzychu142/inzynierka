import { useEffect, useState } from "react";
import { Line } from "@ant-design/plots";
import "./chart.css";
import { useGetAllOrdersQuery } from "../../features/orderSlice";
import LoadingSpinner from "../loading/LoadingSpinner";
import { Result } from "antd";

const Chart = () => {
  const {
    data: orders,
    isLoading,
    isError,
    refetch,
  } = useGetAllOrdersQuery("");

  console.log(orders, "orders");

  const data = [
    { year: "1991", value: 3 },
    { year: "1992", value: 4 },
    { year: "1995", value: 23 },
    { year: "1997", value: 4 },
    { year: "2001", value: 12 },
    { year: "2002", value: 17 },
    { year: "2009", value: 2 },
    { year: "2011", value: 29 },
  ];

  const config = {
    data,
    xField: "year",
    yField: "value",
    point: {
      size: 6,
      shape: "diamond",
      color: "#9AE19D",
    },
    color: "#537A5A",
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return (
      <Result
        status="error"
        title="Somthing goes wrong"
        subTitle="Please try later"
      ></Result>
    );

  return orders ? (
    <section className="chart">
      <h2>Number of orders per month</h2>
      <Line {...config} />
    </section>
  ) : (
    <p>No data available</p>
  );
};

export default Chart;
