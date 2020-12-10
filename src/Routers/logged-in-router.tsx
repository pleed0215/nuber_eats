import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import { toast } from "react-toastify";
import { UserRole } from "../codegen/globalTypes";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { NotFound } from "../pages/404";
import { Restaurants } from "../pages/client/restaurants";
import { EditProfile } from "../pages/user/me.page";
import { VerificationPage } from "../pages/user/verification.page";

const ClientRoutes = [
  <Route path="/" exact>
    <Restaurants />
  </Route>,
  <Route path="/verification">
    <VerificationPage />
  </Route>,
  <Route path="/me">
    <EditProfile />
  </Route>,
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  const history = useHistory();

  if (error) {
    toast.error("Critical error found..");
    history.push("/");
  }

  if (!data || loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }

  return (
    <Router>
      <Header />
      <Switch>
        {data?.me?.role === UserRole.Client && ClientRoutes}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
