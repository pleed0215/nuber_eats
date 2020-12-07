import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { gql, useQuery } from "@apollo/client";
import { LoggedInRouter } from "./Routers/logged-in-router";
import { LoggedOutRouter } from "./Routers/logged-out-router";
import { isLoggedInVar } from "./apollo";

const GQL_LOGGED_IN = gql`
  {
    isLoggedIn @client
  }
`;

function App() {
  const {
    data: { isLoggedIn },
    loading,
    error,
  } = useQuery(GQL_LOGGED_IN);

  if (loading) return <span>still loading</span>;
  if (error) return <span>Error: {error}</span>;

  return isLoggedInVar() ? <LoggedInRouter /> : <LoggedOutRouter />;
}

export default App;
