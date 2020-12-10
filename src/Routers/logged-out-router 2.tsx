import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { CreateAccountPage } from "../pages/create-account";
import { LoginPage } from "../pages/logint";

export const LoggedOutRouter = () => {
  return <Router>
    <Switch>
      <Route path="/create-account">
        <CreateAccountPage />
      </Route>
      <Route path="/">
        <LoginPage />
      </Route>
    </Switch>
  </Router>;
};
