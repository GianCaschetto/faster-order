import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "./routes";
import ErrorPage from "@/pages/error/ErrorPage";
import MenuPage from "@/pages/menu/MenuPage";
import SignInPage from "@/pages/admin/signin/SignInPage";
import CurrencyProvider from "@/contexts/CurrencyContext";
import ProtectedRoute from "./ProtectedRoute";
import AdminPanel from "@/pages/admin/AdminPanel";
import AdminLayout from "@/layouts/AdminLayout";
import CompanyPage from "@/pages/admin/company/CompanyPage";
import ProductsPage from "@/pages/admin/products/ProductsPage";
import { AdminProvider } from "@/contexts/AdminContext";
import ProductsRegister from "@/pages/admin/products/ProductsRegister";
import ProductEdit from "@/pages/admin/products/ProductEdit";
import MediaPage from "@/pages/admin/media/MediaPage";
import MediaProvider from "@/contexts/MediaContext";

const router = createBrowserRouter([
  {
    path: routes.home,
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <AdminProvider>
            <CurrencyProvider>
              <MenuPage />
            </CurrencyProvider>
          </AdminProvider>
        ),
      },
      { path: routes.signIn, element: <SignInPage /> },
    ],
  },
  {
    path: routes.adminPanel,

    element: (
      <AdminProvider>
        <MediaProvider>
          <AdminLayout />
        </MediaProvider>
      </AdminProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        ),
      },
      {
        path: routes.products,
        element: (
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: routes.company,
        element: (
          <ProtectedRoute>
            <CompanyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: routes.productsRegister,
        element: (
          <ProtectedRoute>
            <ProductsRegister />
          </ProtectedRoute>
        ),
      },
      {
        path: routes.productsEdit,
        element: (
          <ProtectedRoute>
            <ProductEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: routes.media,
        element: (
          <ProtectedRoute>
            <MediaPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function AppStack() {
  return <RouterProvider router={router} />;
}

export default AppStack;
