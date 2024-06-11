import LineChart from "@/components/LineChart";
import PieChart from "@/components/PieChart";
import { useAdmin } from "@/contexts/AdminContext";
import { DataChartType, Order, OrderStatus } from "@/types/types";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

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
  //Cantidad de productos vendidos
  const [productsSold, setProductsSold] = useState<number>(0);
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


  const getSalesPerDay = (orders: Order[]): Record<string, number> => {
    let salesPerDay: Record<string, number> = {};
  
    orders.forEach((order) => {
      const day = order.createdAt.toDate().toLocaleDateString();
  
      if (!salesPerDay[day]) {
        salesPerDay[day] = order.total;
      } else {
        salesPerDay[day] += order.total;
      }
    });
  
    salesPerDay = Object.fromEntries(
      Object.entries(salesPerDay).sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    );

    return salesPerDay;
  };

  const salesPerMonth = getSalesPerDay(orders);

  const lineLabels = Object.keys(salesPerMonth);
  const lineData = Object.values(salesPerMonth);

  useEffect(() => {
    if (soldProducts) {
      const total = soldProducts.reduce(
        (acc, product) => acc + product.quantity,
        0
      );
      setProductsSold(total);
    }
  }, [soldProducts]);

  useEffect(() => {
    if (completedOrders) {
      const total = completedOrders.reduce(
        (acc, order) => acc + order.subtotal,
        0
      );
      const formattedTotal = parseFloat(total.toFixed(2));
      setTotalSells(formattedTotal);
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
      <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                $ {totalSells}
              </span>
              <h3 className="text-base font-normal text-gray-500">
                Ventas totales
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                {orders?.length}
              </span>
              <h3 className="text-base font-normal text-gray-500">
                Pedidos totales
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                {completedOrders?.length}
              </span>
              <h3 className="text-base font-normal text-gray-500">
                Pedidos completados
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                {productsSold}
              </span>
              <h3 className="text-base font-normal text-gray-500">
                Productos vendidos
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div className="flex mt-4 justify-around ">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 w-1/3 ">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Productos vendidos
              </h3>
              <span className="text-base font-normal text-gray-500">
                En esta gráfica se muestra la cantidad de productos vendidos
              </span>
            </div>
          </div>
          <div className="flex flex-col mt-8 ">
            <div className="overflow-x-auto rounded-lg">
              <div className="align-middle inline-block min-w-full">
                <div
                  style={{
                    width: "450px",
                    height: "225px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <PieChart data={data} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 w-2/3 mx-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="mb-4 flex items-center justify-between w-full">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Últimos pedidos
                </h3>
                <span className="text-base font-normal text-gray-500">
                  Aquí se muestran los últimos pedidos realizados
                </span>
              </div>
              <div className="flex-shrink-0">
                <NavLink
                  to="/admin-panel/orders-history"
                  className="text-sm font-medium text-cyan-600 hover:bg-gray-100 rounded-lg p-2"
                >
                  Ver todas las ordenes
                </NavLink>
              </div>
            </div>
          </div>
          <div className="flex flex-col mt-8">
            <div className="overflow-x-auto rounded-lg">
              <div className="align-middle inline-block min-w-full">
                <div className="shadow overflow-hidden sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Cliente
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Fecha
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {orders?.slice(0, 3).map((order) => (
                        <tr key={order.id}>
                          <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900">
                            Pedido hecho por{" "}
                            <span className="font-semibold">
                              {order.customer?.name}
                            </span>
                          </td>
                          <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-500">
                            {order.createdAt?.toDate().toLocaleDateString() ??
                              ""}
                          </td>
                          <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            ${order.subtotal}
                          </td>
                        </tr>
                      )) ?? []}

                      <tr>
                        <NavLink
                          to="/admin-panel/orders-history"
                          className="px-4 py-2 text-sm font-medium text-cyan-600 hover:bg-gray-100 rounded-lg"
                        >
                          Ver todas las ordenes
                        </NavLink>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 w-1/3 mt-4 ">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Período de ventas
            </h3>
            <span className="text-base font-normal text-gray-500">
              En esta gráfica se muestra el comportamiento de las ventas en el
              año
            </span>
          </div>
        </div>
        <div className="flex flex-col mt-8 ">
          <div className="overflow-x-auto rounded-lg">
            <div className="align-middle inline-block min-w-full">
              <div
                style={{
                  width: "450px",
                  height: "225px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <LineChart data={{
                    labels: lineLabels,
                    datasets: [
                      {
                        label: "Ventas",
                        data: lineData,
                        fill: false,
                        borderColor: "rgba(75, 192, 192, 1)",
                        tension: 0.1,
                      },
                    ],
                  
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
