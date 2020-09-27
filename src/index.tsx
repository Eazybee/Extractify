import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Routes from "./components/Routes";
import UserProvider from "./contexts/User";

ReactDOM.render(
  <UserProvider>
    <Routes />
  </UserProvider>,
  document.getElementById("root")
);
