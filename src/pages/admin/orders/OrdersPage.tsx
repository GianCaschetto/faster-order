import { useAdmin } from "@/contexts/AdminContext";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Order, OrderStatus } from "@/types/types";
import OrderDetails from "@/pages/admin/orders/OrderDetails";

function OrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [orderSelected, setOrderSelected] = useState<Order | null>(null);

  const { orders, adminData } = useAdmin();

  return (
    <div>
      <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
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
                    className="h-10 mr-2"
                    alt={`${adminData?.companyName} logo`}
                  />
                  <span className="self-center whitespace-nowrap">
                    {adminData?.companyName}
                  </span>
                </NavLink>
                <NavLink
                  to="/admin-panel"
                  className="text-sm font-bold flex items-center lg:ml-2.5 active:text-black"
                >
                  <span className="self-center whitespace-nowrap text-black">
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
                <ul className="space-y-2 pb-2">
                  {orders
                    ?.sort((a, b) => {
                      if (a.status === OrderStatus.nuevo) return -1;
                      if (b.status === OrderStatus.nuevo) return 1;
                      return 0;
                    })
                    ?.map((order) => (
                      <li
                        key={order.orderNumber}
                        className={`bg-gray-50 p-2 shadow-sm hover:bg-gray-100 hover:text-black ${
                          orderSelected?.orderNumber === order?.orderNumber
                            ? "bg-yellow-200"
                            : "bg-gray-200"
                        }`}
                      >
                        <button
                          onClick={() => {
                            setOrderSelected(order);
                            setSidebarOpen(false);
                          }}
                          className={` flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg w-full text-black`}
                        >
                          <span className="truncate">{order.orderNumber}</span>
                          <span className="text-gray-500 text-xs">
                            {order.status}
                          </span>
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </aside>

        <div id="main-content" className="h-screen w-full bg-gray-50">
          <div className="text-gray-900 h-auto w-full relative">
            {orderSelected ? (
              <OrderDetails orderSelected={orderSelected} />
            ) : (
              "Selecciona una orden"
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
