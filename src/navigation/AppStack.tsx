import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "./routes";
import ErrorPage from "@/pages/error/ErrorPage";
import MenuPage from "@/pages/menu/MenuPage";
import SignInPage from "@/pages/signin/SignInPage";
import CartProvider from "@/contexts/CartContext";

const router = createBrowserRouter([
  {
    path: routes.home,
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <CartProvider>
            <MenuPage />
          </CartProvider>
        ),
      },
      { path: routes.signIn, element: <SignInPage /> },
    ],
  },
]);

function AppStack() {
  return <RouterProvider router={router} />;
}

export default AppStack;
