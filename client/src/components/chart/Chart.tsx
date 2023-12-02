import { useEffect, useState } from "react";
import { Line } from "@ant-design/plots";
import "./chart.css";

const Chart = () => {
  const [title, setTitle] = useState("Number of orders per month");

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
    theme: {
      styleSheet: {
        // backgroundColor: "#909590",
        // borderColor: "#909590",
      },
    },
  };

  return (
    <section className="chart">
      <h2>{title}</h2>
      <Line {...config} />
    </section>
  );
};

export default Chart;
