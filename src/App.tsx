import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { gql, useQuery } from "@apollo/client";
import { LoggedInRouter } from "./Routers/logged-in-router";
import { LoggedOutRouter } from "./Routers/logged-out-router";
import { isLoggedInVar } from "./apollo";

function App() {
  return isLoggedInVar() ? <LoggedInRouter /> : <LoggedOutRouter />;
}

export default App;
