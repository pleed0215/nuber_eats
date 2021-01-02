import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NotFound } from "../pages/404";
import { CreateAccountPage } from "../pages/create-account";
import { LoginPage } from "../pages/logint";

export const LoggedOutRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/create-account" exact>
          <CreateAccountPage />
        </Route>
        <Route path="/">
          <LoginPage />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
