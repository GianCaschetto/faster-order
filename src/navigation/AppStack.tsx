import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "./routes";
import ErrorPage from "@/pages/error/ErrorPage";
import MenuPage from "@/pages/menu/MenuPage";
import SignInPage from "@/pages/admin/signin/SignInPage";
import CurrencyProvider from "@/contexts/CurrencyContext";
import ProtectedRoute from "./ProtectedRoute";
import AdminPanel from "@/pages/admin/AdminPanel";
import AdminLayout from "@/layouts/AdminLayout";

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
    element: <AdminLayout />,
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
            <h1>Products</h1>
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
