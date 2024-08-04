import { useMemo } from "react";
import { Order, OrderStatus } from "@/types/types";
import BarChart from "./BarChart";

type OrdersStatusChartProps = {
  orders: Order[];
};

const OrdersStatusChart = ({ orders }: OrdersStatusChartProps) => {
  const orderStatusCounts = useMemo(() => {
    const statusCounts = {
      [OrderStatus.nuevo]: 0,
      [OrderStatus.enProceso]: 0,
      [OrderStatus.enviado]: 0,
      [OrderStatus.entregado]: 0,
      [OrderStatus.cancelado]: 0,
      [OrderStatus.finalizado]: 0,
    };

    orders.forEach((order) => {
      statusCounts[order.status]++;
    });

    return statusCounts;
  }, [orders]);

  const data = {
    labels: Object.keys(OrderStatus),
    datasets: [
      {
        label: "Número de Pedidos",
        data: Object.values(orderStatusCounts),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return <BarChart data={data} />;
};

export default OrdersStatusChart;
