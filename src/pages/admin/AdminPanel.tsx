import OrdersStatusChart from "@/components/OrdersStatusChart";
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
  const [productsSold, setProductsSold] = useState<number>(0);
  const { orders } = useAdmin();

  const [dateFilter, setDateFilter] = useState<string>("last_30_days");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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

  const filterOrdersByDate = (orders: Order[]): Order[] => {
    const now = new Date();
    let filteredOrders = orders;

    switch (dateFilter) {
      case "today":
        filteredOrders = orders.filter((order) => {
          const orderDate = order.createdAt.toDate();
          return orderDate.toDateString() === now.toDateString();
        });
        break;
      case "last_7_days":
        filteredOrders = orders.filter((order) => {
          const orderDate = order.createdAt.toDate();
          return (
            orderDate > new Date(now.setDate(now.getDate() - 7)) &&
            orderDate <= new Date()
          );
        });
        break;
      case "last_30_days":
        filteredOrders = orders.filter((order) => {
          const orderDate = order.createdAt.toDate();
          return (
            orderDate > new Date(now.setDate(now.getDate() - 30)) &&
            orderDate <= new Date()
          );
        });
        break;
      case "custom_range":
        if (startDate && endDate) {
          filteredOrders = orders.filter((order) => {
            const orderDate = order.createdAt.toDate();
            return orderDate >= startDate && orderDate <= endDate;
          });
        }
        break;
      case "all":
        // No filtering needed for "all"
        filteredOrders = orders;
        break;
      default:
        break;
    }

    return filteredOrders;
  };

  // const getSalesPerDay = (orders: Order[]): Record<string, number> => {
  //   let salesPerDay: Record<string, number> = {};

  //   orders.forEach((order) => {
  //     const day = order.createdAt.toDate().toLocaleDateString();

  //     if (!salesPerDay[day]) {
  //       salesPerDay[day] = order.total;
  //     } else {
  //       salesPerDay[day] += order.total;
  //     }
  //   });

  //   salesPerDay = Object.fromEntries(
  //     Object.entries(salesPerDay).sort(
  //       (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
  //     )
  //   );

  //   return salesPerDay;
  // };

  const filteredOrders = filterOrdersByDate(orders as Order[]);
  // const salesPerMonth = getSalesPerDay(filteredOrders);

  // const lineLabels = Object.keys(salesPerMonth);
  // const lineData = Object.values(salesPerMonth);

  const finishedOrders = filteredOrders.filter(order => order.finishedAt);
  const averageTimeInMillis = finishedOrders.length > 0 ? finishedOrders.reduce((total, order) => {
    const timeDifference = order.finishedAt && order.createdAt ? order.finishedAt.toDate().getTime() - order.createdAt.toDate().getTime() : 0;
    return total + timeDifference;
  }, 0) / finishedOrders.length : 0;

  // Convertir el tiempo promedio de milisegundos a horas, minutos y segundos
  const averageTimeInHours = new Date(averageTimeInMillis).toISOString().substr(11, 8);

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
      const completedOrders = filteredOrders.filter(
        (order) => order.status === OrderStatus.finalizado
      );
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
  }, [orders, dateFilter, startDate, endDate]);

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value ? new Date(e.target.value) : null;
    setStartDate(newStartDate);

    if (
      newStartDate &&
      endDate &&
      newStartDate.getFullYear() !== endDate.getFullYear()
    ) {
      const newEndDate = new Date(newStartDate);
      newEndDate.setMonth(11);
      newEndDate.setDate(31);
      setEndDate(newEndDate);
    }
  };

  return (
    <div className="text-gray-900 h-screen w-full">
      <div className="mt-4 w-full flex justify-between items-center">
        <div>
          <select
            id="date-filter"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="today">Hoy</option>
            <option value="last_7_days">Últimos 7 días</option>
            <option value="last_30_days">Últimos 30 días</option>
            <option value="custom_range">Rango personalizado</option>
            <option value="all">Todo</option>
          </select>
        </div>
        {dateFilter === "custom_range" && (
          <div className="flex space-x-4">
            <div>
              <label
                htmlFor="start-date"
                className="block text-sm font-medium text-gray-700"
              >
                Fecha de inicio
              </label>
              <input
                type="date"
                id="start-date"
                value={startDate ? startDate.toISOString().split("T")[0] : ""}
                onChange={handleStartDateChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="end-date"
                className="block text-sm font-medium text-gray-700"
              >
                Fecha de fin
              </label>
              <input
                type="date"
                id="end-date"
                value={endDate ? endDate.toISOString().split("T")[0] : ""}
                onChange={(e) =>
                  setEndDate(e.target.value ? new Date(e.target.value) : null)
                }
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
                {filteredOrders.length}
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
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                ${" "}
                {filteredOrders.length > 0
                  ? Number(
                      filteredOrders.reduce(
                        (acc, order) => acc + order.total,
                        0
                      ) / filteredOrders.length
                    ).toFixed(2)
                  : 0}
              </span>
              <h3 className="text-base font-normal text-gray-500">
                Ticket Promedio
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                {averageTimeInHours.split(":")[0]}h {averageTimeInHours.split(":")[1]}m {averageTimeInHours.split(":")[2]}s
              </span>
              <h3 className="text-base font-normal text-gray-500">
                Tiempo promedio de venta
              </h3>
            </div>
          </div>
        </div>
        
      </div>
      <div className="flex flex-col lg:flex-row mt-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 flex-grow w-full lg:w-3/5 text-center mx-auto">
          <div className="mb-4 mx-auto">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Productos vendidos
              </h3>
              <span className="text-base font-normal text-gray-500">
                En esta gráfica se muestra la cantidad de productos vendidos
              </span>
            </div>
          </div>
          <div
            style={{
              width: "100%",
              height: "100%",
              maxWidth: "450px",
              maxHeight: "225px",
              margin: "0 auto",
            }}
          >
            <PieChart data={data} />
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 flex-grow w-full lg:w-2/5">
          <div className="mb-4 flex items-center justify-between">
            <div className="w-full">
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
                      {filteredOrders.slice(0, 3).map((order) => (
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
                            ${order.total}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td>
                          <NavLink
                            to="/admin-panel/orders-history"
                            className="text-sm font-medium text-cyan-600 hover:bg-gray-100 rounded-lg p-2"
                          >
                            Ver todas las ordenes
                          </NavLink>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 mt-4">
        <div className="mb-4 flex">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Estado actual de las ordenes
            </h3>
            <span className="text-base font-normal text-gray-500">
              Aquí se muestra el estado actual de las ordenes
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="overflow-x-auto rounded-lg">
            <div className="align-middle min-w-full">
              <div
                style={{
                  width: "100%",
                  height: "400px",
                }}
              >
                <OrdersStatusChart orders={filteredOrders} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
