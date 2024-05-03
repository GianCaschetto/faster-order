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
    ],
  },
  {
    path: routes.adminPanel,
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <AdminPanel />,
      },
      {
        path: routes.products,
        element: <ProductsPage />,
      },
      {
        path: routes.company,
        element: <CompanyPage />,
      },
      {
        path: routes.productsRegister,
        element: <ProductsRegister />,
      },
      {
        path: routes.productsEdit,
        element: <ProductEdit />,
      },
      {
        path: routes.media,
        element: <MediaPage />,
      },
      {
        path: routes.neighborhoods,
        element: <NeighborhoodsPage />,
      },
      {
        path: routes.schedule,
        element: <SchedulesPage />,
      },
    ],
  },
]);

function AppStack() {
  return <RouterProvider router={router} />;
}

export default AppStack;
