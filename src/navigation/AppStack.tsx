import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "./routes";
import ErrorPage from "@/pages/error/ErrorPage";
import MenuPage from "@/pages/menu/MenuPage";
import SignInPage from "@/pages/admin/signin/SignInPage";
import ProtectedRoute from "./ProtectedRoute";
import AdminPanel from "@/pages/admin/AdminPanel";
import AdminLayout from "@/layouts/AdminLayout";
import CompanyPage from "@/pages/admin/company/CompanyPage";
import ProductsPage from "@/pages/admin/products/ProductsPage";
import ProductsRegister from "@/pages/admin/products/ProductsRegister";
import ProductEdit from "@/pages/admin/products/ProductEdit";
import MediaPage from "@/pages/admin/media/MediaPage";
import NeighborhoodsPage from "@/pages/admin/Neightborhoods/NeighborhoodsPage";
import SchedulesPage from "@/pages/admin/Schedules/SchedulesPage";
import OrderMessage from "@/pages/admin/shippingMessage/OrderMessage";
import OrdersPage from "@/pages/admin/orders/OrdersPage";
import TrackOrder from "@/pages/order/TrackOrder";
import CompanyChatAi from "@/pages/admin/company-chat-ai/CompanyChatAi";
import OrdersHistoryPage from "@/pages/admin/orders/ordersHistory/OrdersHistoryPage";
import OrdersHistoryRegister from "@/pages/admin/orders/ordersHistory/OrdersHistoryRegister";
import OrdersHistoryEdit from "@/pages/admin/orders/ordersHistory/OrdersHistoryEdit";

const router = createBrowserRouter([
  {
    path: routes.home,
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <MenuPage />,
      },
      { path: routes.signIn, element: <SignInPage /> },
      { path: routes.trackOrder, element: <TrackOrder /> },
    ],
  },
  {
    path: routes.adminPanel,
    element: (
      <ProtectedRoute>
        <Outlet />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <AdminLayout>
            <AdminPanel />
          </AdminLayout>
        ),
      },
      {
        path: routes.products,
        element: (
          <AdminLayout>
            <ProductsPage />
          </AdminLayout>
        ),
      },
      {
        path: routes.productsRegister,
        element: (
          <AdminLayout>
            <ProductsRegister />
          </AdminLayout>
        ),
      },
      {
        path: routes.productsEdit,
        element: (
          <AdminLayout>
            <ProductEdit />
          </AdminLayout>
        ),
      },
      {
        path: routes.company,
        element: (
          <AdminLayout>
            <CompanyPage />
          </AdminLayout>
        ),
      },

      {
        path: routes.media,
        element: (
          <AdminLayout>
            <MediaPage />
          </AdminLayout>
        ),
      },
      {
        path: routes.neighborhoods,
        element: (
          <AdminLayout>
            <NeighborhoodsPage />
          </AdminLayout>
        ),
      },
      {
        path: routes.schedule,
        element: (
          <AdminLayout>
            <SchedulesPage />
          </AdminLayout>
        ),
      },
      {
        path: routes.shippingMessage,
        element: (
          <AdminLayout>
            <OrderMessage />
          </AdminLayout>
        ),
      },
      {
        path: routes.orders,
        element: <OrdersPage />,
      },
      {
        path: routes.ordersHistory,
        element: (
          <AdminLayout>
            <OrdersHistoryPage />
          </AdminLayout>
        ),
      },
      {
        path: routes.ordersHistoryRegister,
        element: (
          <AdminLayout>
            <OrdersHistoryRegister />
          </AdminLayout>
        ),
      },
      {
        path: routes.ordersHistoryEdit,
        element: (
          <AdminLayout>
            <OrdersHistoryEdit />
          </AdminLayout>
        ),
      },
      {
        path: routes.companyChatAi,
        element: (
          <AdminLayout>
            <CompanyChatAi />
          </AdminLayout>
        ),
      },
      // {
      //   path: routes.orderDetail,
      //   element: (
      //     <OrdersLayout>
      //       <OrderDetails />
      //     </OrdersLayout>
      //   ),
      // },
    ],
  },
]);

function AppStack() {
  return <RouterProvider router={router} />;
}

export default AppStack;
