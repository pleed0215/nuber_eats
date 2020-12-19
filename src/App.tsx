import React from "react";
import { LoggedInRouter } from "./routers/logged-in-router";
import { LoggedOutRouter } from "./routers/logged-out-router";
import { isLoggedInVar } from "./apollo";
import { useReactiveVar } from "@apollo/client";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);  
  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
}

export default App;
