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
import { CategoryPage } from "../pages/client/category";
import { Restaurant } from "../pages/client/restaurant";
import { RestaurantsPage } from "../pages/client/restaurants";
import { SearchPage } from "../pages/client/search";
import { LogOutPage } from "../pages/user/logout";
import { EditProfile } from "../pages/user/me.page";
import { UpdatePassword } from "../pages/user/password.page";
import { VerificationPage } from "../pages/user/verification.page";

const ClientRoutes = [
  <Route key={1} path="/" exact>
    <RestaurantsPage />
  </Route>,
  <Route key={2} path="/verification">
    <VerificationPage />
  </Route>,
  <Route key={3} path="/me">
    <EditProfile />
  </Route>,
  <Route key={4} path="/password">
    <UpdatePassword />
  </Route>,
  <Route key={5} path="/logout">
    <LogOutPage />
  </Route>,
  <Route key={6} path="/search">
    <SearchPage />
  </Route>,
  <Route key={7} path="/category/:slug">
    <CategoryPage />
  </Route>,
  <Route key={8} path="/restaurant/:id">
    <Restaurant />
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
