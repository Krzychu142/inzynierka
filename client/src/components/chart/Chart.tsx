import { useEffect, useState } from "react";
import { Line } from "@ant-design/plots";
import "./chart.css";
import { useGetAllOrdersQuery } from "../../features/orderSlice";
import LoadingSpinner from "../loading/LoadingSpinner";
import { Result } from "antd";
import { IOrder } from "../../types/order.interface";
import { MonthlyOrderCount } from "../../types/monthlyOrderCount.interface";

const Chart = () => {
  const { data: orders, isLoading, isError } = useGetAllOrdersQuery("");

  const [chartData, setChartData] = useState<MonthlyOrderCount[]>([]);

  const getLatestOrderDate = (orders: IOrder[]): Date => {
    const sortedOrders = [...orders].sort(
      (a, b) =>
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );

    return new Date(sortedOrders[0].orderDate);
  };

  const getTwelveLatestDates = (orders: IOrder[]): string[] => {
    if (orders.length === 0) {
      return [];
    }

    const latestDate: Date = getLatestOrderDate(orders);
    const dates: string[] = [];
    let date = new Date(latestDate);

    for (let i = 0; i < 12; i++) {
      dates.push(date.toISOString().slice(0, 7));
      date.setMonth(date.getMonth() - 1);
    }

    return dates.reverse();
  };

  const sumOrdersByMonth = (orders: IOrder[]): MonthlyOrderCount[] => {
    const months: string[] = getTwelveLatestDates(orders);
    const orderCounts: { [key: string]: number } = {};

    months.forEach((month) => (orderCounts[month] = 0));

    orders.forEach((order) => {
      const orderDate = new Date(order.orderDate);
      const orderMonth: string = orderDate.toISOString().slice(0, 7);

      if (months.includes(orderMonth)) {
        orderCounts[orderMonth]++;
      }
    });

    return months.map((month) => ({
      month,
      value: orderCounts[month],
    }));
  };

  useEffect(() => {
    if (orders) {
      const processedData = sumOrdersByMonth(orders);
      console.log(processedData);
      setChartData(processedData);
    }
  }, [orders]);

  const config = {
    data: chartData,
    xField: "month",
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
      <h2>Count of orders per month</h2>
      <Line {...config} />
    </section>
  ) : (
    <p>No data available</p>
  );
};

export default Chart;
