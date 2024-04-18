import React from "react";
import AppStack from "./navigation/AppStack";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
      <React.Fragment>
        <ToastContainer />
        <AppStack />
      </React.Fragment> 
  );
}

export default App;
