import React, { useEffect } from "react";
import AppStack from "./navigation/AppStack";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminProvider, useAdmin } from "./contexts/AdminContext";
import MediaProvider from "./contexts/MediaContext";
import CurrencyProvider from "./contexts/CurrencyContext";

function App() {
  const { adminData } = useAdmin();

  useEffect(() => {
    if (adminData?.colors) {
      document.documentElement.style.setProperty(
        "--primary-color",
        adminData?.colors?.primary
      );
      document.documentElement.style.setProperty(
        "--secondary-color",
        adminData?.colors?.secondary
      );
    }
  }, [adminData?.colors?.primary, adminData?.colors?.secondary]);

  return (
    <React.Fragment>
      <AuthProvider>
        <AdminProvider>
          <MediaProvider>
            <CurrencyProvider>
              <ToastContainer />
              <AppStack />
            </CurrencyProvider>
          </MediaProvider>
        </AdminProvider>
      </AuthProvider>
    </React.Fragment>
  );
}

export default App;
