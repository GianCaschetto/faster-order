import CollapsibleMenuItem from "@/components/CollapsibleMenuItem";
import { useAdmin } from "@/contexts/AdminContext";
import { routes } from "@/navigation/routes";
import { auth } from "@/services/firebase";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  const { adminData } = useAdmin();

  useEffect(() => {
    setIsActive(location.pathname);
  }, [location]);

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
              <NavLink
                to="/"
                className="text-xl font-bold flex items-center lg:ml-2.5 active:text-black"
              >
                <img src={adminData?.logo} className="h-10 mr-2" alt="Logo" />
                <span className="self-center whitespace-nowrap">
                  {adminData?.companyName}
                </span>
              </NavLink>
            </div>
            <div className="flex items-center">
              <button
                id="toggleSidebarMobileSearch"
                type="button"
                className="lg:hidden text-gray-500 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg"
              >
                <span className="sr-only">Search</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
              <div className="hidden lg:flex items-center">
                <span className="text-base font-normal text-gray-500 mr-5">
                  Universidad José Antonio Páez ❤️
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex overflow-y-auto bg-white pt-16 h-screen">
        <div
          onClick={() => setSidebarOpen(false)}
          className={`${
            !sidebarOpen && "hidden"
          } bg-gray-600/50 min-h-screen w-full fixed top-0 left-0 right-0 backdrop-blur-sm z-10`}
        ></div>
        <aside
          id="sidebar"
          className={` ${
            sidebarOpen ? "w-72" : "w-0"
          } min-h-full lg:flex flex-shrink-0 flex-col transition-all duration-300 z-20 md:w-72`}
          aria-label="Sidebar"
        >
          <div className="relative flex-1 flex flex-col min-h-full border-r border-gray-200 bg-white pt-0">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex-1 px-3 bg-white divide-y space-y-1">
                <ul className="space-y-2 pb-2">
                  <li>
                    <form action="#" method="GET" className="lg:hidden">
                      <label htmlFor="mobile-search" className="sr-only">
                        Search
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="w-5 h-5 text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="email"
                          id="mobile-search"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 block w-full pl-10 p-2.5"
                          placeholder="Search"
                        />
                      </div>
                    </form>
                  </li>
                  <li>
                    <NavLink
                      to={routes.adminPanel}
                      className={`text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group border-b ${
                        isActive === routes.adminPanel ? "bg-gray-100" : ""
                      }`}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-dashboard"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 13m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                        <path d="M13.45 11.55l2.05 -2.05" />
                        <path d="M6.4 20a9 9 0 1 1 11.2 0z" />
                      </svg>
                      <span className="ml-3">Dashboard</span>
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to={routes.company}
                      className={`text-base border-b  text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ${
                        isActive === routes.company ? "bg-gray-100" : ""
                      }`}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-user"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                      </svg>
                      <span className="ml-3 flex-1 whitespace-nowrap">
                        Empresa
                      </span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={routes.neighborhoods}
                      className={`text-base border-b  text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ${
                        isActive === routes.neighborhoods ? "bg-gray-100" : ""
                      }`}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-map-pin"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                        <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
                      </svg>
                      <span className="ml-3 flex-1 whitespace-nowrap">
                        Zonas
                      </span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={routes.schedule}
                      className={`text-base border-b  text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ${
                        isActive === routes.schedule ? "bg-gray-100" : ""
                      }`}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-clock"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                        <path d="M12 7v5l3 3" />
                      </svg>
                      <span className="ml-3 flex-1 whitespace-nowrap">
                        Horario de Apertura
                      </span>
                    </NavLink>
                  </li>
                  <div className="flex"></div>
                  <CollapsibleMenuItem title="Ecommerce">
                    <ul>
                      <li>
                        <NavLink
                          to={routes.products}
                          className={`text-base text-gray-900 font-normal rounded-lg hover:bg-slate-300  flex items-center p-2 group ${
                            isActive === routes.products && "bg-gray-100"
                          }`}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="icon icon-tabler icons-tabler-outline icon-tabler-shopping-bag"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z" />
                            <path d="M9 11v-5a3 3 0 0 1 6 0v5" />
                          </svg>
                          <span className="ml-3 flex-1 whitespace-nowrap dark:   text-gray-900">
                            Productos
                          </span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={routes.extras}
                          className={`text-base text-gray-900 font-normal rounded-lg hover:bg-slate-300  flex items-center p-2 group ${
                            isActive === routes.extras && "bg-gray-100"
                          }`}
                        >
                          <svg
                            className="icon icon-tabler icon-tabler-basket-plus"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="#2c3e50"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M17 10l-2 -6" />
                            <path d="M7 10l2 -6" />
                            <path d="M12 20h-4.756a3 3 0 0 1 -2.965 -2.544l-1.255 -7.152a2 2 0 0 1 1.977 -2.304h13.999a2 2 0 0 1 1.977 2.304l-.359 2.043" />
                            <path d="M10 14a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                            <path d="M16 19h6" />
                            <path d="M19 16v6" />
                          </svg>
                          <span className="ml-3 flex-1 whitespace-nowrap">
                            Extras
                          </span>
                        </NavLink>
                      </li>
                    </ul>
                  </CollapsibleMenuItem>
                  <li>
                    <NavLink
                      to={routes.shippingMessage}
                      className={`text-base border-b  text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ${
                        isActive === routes.shippingMessage && "bg-gray-100"
                      }`}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-pencil"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                        <path d="M13.5 6.5l4 4" />
                      </svg>
                      <span className="ml-3 flex-1 whitespace-nowrap">
                        Nota de Entrega
                      </span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={routes.media}
                      className={`text-base border-b  text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ${
                        isActive === routes.media && "bg-gray-100"
                      }`}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-camera"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                        <path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                      </svg>
                      <span className="ml-3 flex-1 whitespace-nowrap">
                        Media
                      </span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={routes.orders}
                      className={`text-base border-b  text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ${
                        isActive === routes.orders && "bg-gray-100"
                      }`}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-clipboard"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                        <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                      </svg>
                      <span className="ml-3 flex-1 whitespace-nowrap">
                        Gestionar órdenes
                      </span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={routes.ordersHistory}
                      className={`text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ${
                        isActive === routes.ordersHistory && "bg-gray-100"
                      }`}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-clipboard"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                        <path d="M12 14m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                        <path d="M12 12.496v1.504l1 1" />
                      </svg>
                      <span className="ml-3 flex-1 whitespace-nowrap">
                        Historial de Ordenes
                      </span>
                    </NavLink>
                  </li>
                </ul>
                <div className="space-y-2 pt-2">
                  <NavLink
                    to={routes.companyChatAi}
                    className={`text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group ${
                      isActive === routes.orders && "bg-gray-100"
                    }`}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-brand-hipchat"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M17.802 17.292s.077 -.055 .2 -.149c1.843 -1.425 3 -3.49 3 -5.789c0 -4.286 -4.03 -7.764 -9 -7.764c-4.97 0 -9 3.478 -9 7.764c0 4.288 4.03 7.646 9 7.646c.424 0 1.12 -.028 2.088 -.084c1.262 .82 3.104 1.493 4.716 1.493c.499 0 .734 -.41 .414 -.828c-.486 -.596 -1.156 -1.551 -1.416 -2.29z" />
                      <path d="M7.5 13.5c2.5 2.5 6.5 2.5 9 0" />
                    </svg>
                    <span className="ml-3 flex-1 whitespace-nowrap">
                      Chatea con tu empresa
                    </span>
                  </NavLink>
                  <button
                    onClick={() =>
                      signOut(auth).then(() => {
                        navigate(routes.home);
                        toast.success("Sesión cerrada correctamente");
                      })
                    }
                    className="text-start w-full  text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group "
                  >
                    <svg
                      className="w-6 h-6 text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span className="ml-3 flex-1 whitespace-nowrap">
                      Cerrar sesión
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div
          id="main-content"
          className="h-full w-full bg-gray-50 relative p-2"
        >
          <div className="h-full w-full bg-gray-50 relative overflow-y-auto ">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
