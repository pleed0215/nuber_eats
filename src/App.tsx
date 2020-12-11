import React from "react";
import { LoggedInRouter } from "./Routers/logged-in-router";
import { LoggedOutRouter } from "./Routers/logged-out-router";
import { isLoggedInVar } from "./apollo";
import { useReactiveVar } from "@apollo/client";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  console.log(isLoggedIn);
  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
}

export default App;
