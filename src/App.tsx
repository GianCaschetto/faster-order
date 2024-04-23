import React from "react";
import AppStack from "./navigation/AppStack";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <React.Fragment>
      <AuthProvider>
        <ToastContainer />
        <AppStack />
      </AuthProvider>
    </React.Fragment>
  );
}

export default App;
