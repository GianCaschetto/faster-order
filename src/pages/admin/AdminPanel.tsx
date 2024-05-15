import PieChart from "@/components/PieChart";
import { useAdmin } from "@/contexts/AdminContext";
import { DataChartType, Order, OrderStatus } from "@/types/types";
import { useEffect, useState } from "react";

function AdminPanel() {
  const [totalSells, setTotalSells] = useState<number>(0.0);
  const [completedOrders, setCompletedOrders] = useState<Order[] | null>(null);
  const [soldProducts, setSoldProducts] = useState<
    | {
        name: string;
        quantity: number;
      }[]
    | null
  >(null);
  const { orders } = useAdmin();

  const labels = Array.from(
    new Set(soldProducts?.map((product) => product.name))
  );

  const data: DataChartType = {
    labels: labels,
    datasets: [
      {
        label: "# Vendidos",
        data:
          labels?.map((label) => {
            return (
              soldProducts?.reduce((acc, product) => {
                if (product.name === label) {
                  return acc + product.quantity;
                }
                return acc;
              }, 0) || 0
            );
          }) ?? [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    if (completedOrders) {
      const total = completedOrders.reduce(
        (acc, order) => acc + order.subtotal,
        0
      );
      setTotalSells(total);
    }
  }, [completedOrders]);

  useEffect(() => {
    if (orders) {
      const completedOrders = orders.filter(
        (order) => order.status === OrderStatus.finalizado
      );
      //Array de productos vendidos
      const newSoldProducts = completedOrders?.flatMap((order) => {
        return order.items.map((item) => {
          return {
            name: item.product.name,
            quantity: item.quantity,
          };
        });
      });
      setCompletedOrders(completedOrders);
      setSoldProducts(newSoldProducts);
    }
  }, [orders]);

  return (
    <div className="text-gray-900 h-screen w-full">
      <h1 className="text-3xl font-semibold">Admin Panel</h1>
      <div className="flex">
        <div className="border py-2 px-4 text-center">
          <h2 className="text-2xl font-semibold">Ventas totales</h2>
          <p className="text-lg"> $ {totalSells}</p>
        </div>
        <div className="border py-2 px-4 text-center">
          <h2 className="text-2xl font-semibold">Pedidos totales</h2>
          <p className="text-lg"> {orders?.length}</p>
        </div>
        <div className="border py-2 px-4 text-center">
          <h2 className="text-2xl font-semibold">Pedidos completados</h2>
          <p className="text-lg"> {completedOrders?.length}</p>
        </div>
      </div>
      <div
        style={{
          width: "450px",
          height: "225px",
        }}
      >
        <div style={{
          width: "100%",
          height: "100%",
        }}>
          <PieChart data={data} />
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
