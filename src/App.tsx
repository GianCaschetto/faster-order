import React from "react";
import AppStack from "./navigation/AppStack";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminProvider } from "./contexts/AdminContext";
import MediaProvider from "./contexts/MediaContext";
import CurrencyProvider from "./contexts/CurrencyContext";

function App() {
  
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
