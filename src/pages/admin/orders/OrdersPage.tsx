import { useAdmin } from "@/contexts/AdminContext";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Order } from "@/types/types";
import OrderDetails from "@/pages/admin/orders/OrderDetails";
import Lottie from "react-lottie";
import searchAnimation from "@/assets/lotties/search.json";

export const orderStatusColors = {
  nuevo: "bg-yellow-200",
  "en proceso": "bg-orange-200",
  enviado: "bg-blue-200",
  entregado: "bg-pink-200",
  finalizado: "bg-green-300",
  cancelado: "bg-red-400",
};

function OrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [orderSelected, setOrderSelected] = useState<Order | null>(null);
  const [orderToSearch, setOrderToSearch] = useState<string>("");
  const [ordersWithoutCancelled, setOrdersWithoutCancelled] = useState<
    Order[] | null
  >(null);
  const { orders, adminData } = useAdmin();

  const filteredOrders =
    orderToSearch === ""
      ? ordersWithoutCancelled
      : ordersWithoutCancelled?.filter((order) => {
          return (
            order.customer.name
              .toLowerCase()
              .includes(orderToSearch.toLowerCase()) ||
            order.orderNumber?.toString().includes(orderToSearch) ||
            order.customer.phone.includes(orderToSearch) ||
            order.status.toLowerCase().includes(orderToSearch.toLowerCase()) ||
            order.createdAt
              .toDate()
              .toLocaleDateString()
              .includes(orderToSearch)
          );
        });

  useEffect(() => {
    //Filter the orders that are not cancelled or finished
    const owc = orders?.filter((order) => {
      return order.status !== "cancelado" && order.status !== "finalizado";
    });

    //Sort by status
    owc?.sort((a, b) => {
      if (a.status === "nuevo") {
        return -1;
      }
      if (a.status === "en proceso" && b.status === "nuevo") {
        return 1;
      }
      if (a.status === "enviado" && b.status === "nuevo") {
        return 1;
      }
      if (a.status === "enviado" && b.status === "en proceso") {
        return 1;
      }
      if (a.status === "entregado" && b.status === "nuevo") {
        return 1;
      }
      if (a.status === "entregado" && b.status === "en proceso") {
        return 1;
      }
      if (a.status === "entregado" && b.status === "enviado") {
        return 1;
      }
      if (a.status === "finalizado") {
        return 1;
      }
      if (a.status === "cancelado") {
        return 1;
      }
      return 0;
    });
    setOrdersWithoutCancelled(owc as Order[]);
  }, [orders]);

  return (
    <div>
      <nav className="bg-white border-b border-gray-200 fixed z-30 w-full"
      style={{
        backgroundColor: adminData?.colors?.primary,
      }}>
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                id="toggleSidebarMobile"
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-expanded="true"
                aria-controls="sidebar"
                className="md:hidden mr-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded"
              >
                {sidebarOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-x"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M18 6l-12 12" />
                    <path d="M6 6l12 12" />
                  </svg>
                ) : (
                  <svg
                    id="toggleSidebarMobileHamburger"
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                )}
              </button>
              <div className="flex">
                <NavLink
                  to="/"
                  className="text-xl font-bold flex items-center lg:ml-2.5 active:text-black"
                >
                  <img
                    src={adminData?.logo}
                    className="h-10 mr-2 drop-shadow-md"
                    alt={`${adminData?.companyName} logo`}
                  />
                  <span className="self-center whitespace-nowrap">
                    {adminData?.companyName}
                  </span>
                </NavLink>
                <NavLink
                  to="/admin-panel"
                  className="text-sm font-bold flex items-center lg:ml-2.5 active:text-black
                  
                  "
                >
                  <span className="hitespace-nowrap text-black flex items-center hover:underline ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="mr-2 icon icon-tabler icons-tabler-outline icon-tabler-layout-dashboard"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M5 4h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1" />
                      <path d="M5 16h4a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1" />
                      <path d="M15 12h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1" />
                      <path d="M15 4h4a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1" />
                    </svg>
                    Panel de administración
                  </span>
                </NavLink>
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden lg:flex items-center">
                <span className="text-base font-normal text-gray-500 mr-5">
                  Hecho por Faster Order ❤️
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex overflow-hidden bg-white pt-16">
        <div
          onClick={() => setSidebarOpen(false)}
          className={`${
            !sidebarOpen && "hidden"
          } bg-gray-600/50 min-h-screen w-full fixed top-0 left-0 right-0 backdrop-blur-sm z-10`}
        ></div>
        <aside
          id="sidebar"
          className={` ${
            sidebarOpen ? "w-64" : "w-0"
          } min-h-full lg:flex flex-shrink-0 flex-col transition-all duration-300 z-20 md:w-64`}
          aria-label="Sidebar"
        >
          <div className="relative flex-1 flex flex-col min-h-full border-r border-gray-200 bg-white pt-0">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex-1 px-3 bg-white divide-y space-y-1">
                <div className="flex items-center justify-between w-full px-2 py-1 text-sm font-medium text-gray-900 bg-gray-100">
                  <div className="flex flex-col text-start">
                    <input
                      type="text"
                      placeholder="Buscar..."
                      className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      onChange={(e) => setOrderToSearch(e.target.value)}
                    />
                  </div>
                </div>
                <ul className="space-y-2 overflow-y-auto h-screen">
                  {filteredOrders?.map((order) => (
                    <li key={order.id}>
                      <button
                        onClick={() => setOrderSelected(order)}
                        className="flex items-center justify-between w-full px-2 py-1 text-sm font-medium text-gray-900 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
                      >
                        <div className="flex flex-col text-start">
                          <span className="text-xs font-bold">
                            {order.orderNumber}
                          </span>
                          <span className="text-xs">{order.customer.name}</span>
                          <span className="text-xs">
                            {order.createdAt.toDate().toLocaleDateString()}
                          </span>
                        </div>
                        <div
                          className={`text-xs ${
                            orderStatusColors[order.status]
                          } px-2 py-1 rounded-lg font-bold uppercase ${
                            order.status.toLowerCase() === "cancelado" &&
                            "line-through"
                          } ${
                            order.status.toLowerCase() === "finalizado" &&
                            "line-through"
                          }`}
                        >
                          {order.status.toString().toUpperCase()}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </aside>

        <div id="main-content" className="h-full w-full  relative">
          <div className="text-gray-900 w-full relative">
            {orderSelected ? (
              <OrderDetails orderSelected={orderSelected} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-1/3 mx-auto">
                <h2 className="text-2xl font-bold text-gray-700 mt-4">
                  Selecciona o crea una orden
                </h2>
                <Lottie
                  options={{
                    loop: true,
                    autoplay: true,
                    animationData: searchAnimation,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
