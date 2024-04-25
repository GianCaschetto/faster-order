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

const router = createBrowserRouter([
  {
    path: routes.home,
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <CurrencyProvider>
            <MenuPage />
          </CurrencyProvider>
        ),
      },
      { path: routes.signIn, element: <SignInPage /> },
    ],
  },
  {
    path: routes.adminPanel,

    element: (
      <AdminProvider>
        <AdminLayout />
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
      }
    ],
  },
]);

function AppStack() {
  return <RouterProvider router={router} />;
}

export default AppStack;
