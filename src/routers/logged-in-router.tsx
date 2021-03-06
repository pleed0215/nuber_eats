import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { UserRole } from "../codegen/globalTypes";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { NotFound } from "../pages/404";
import { CategoryPage } from "../pages/client/category";
import { Restaurant } from "../pages/client/restaurant";
import { RestaurantsPage } from "../pages/client/restaurants";
import { SearchPage } from "../pages/client/search";
import { CreateRestaurant } from "../pages/restaurant/create.restaurant";
import { MyRestaurants } from "../pages/restaurant/my.restaurants";
import { MyRestaurant } from "../pages/restaurant/my.restaurant";
import { LogOutPage } from "../pages/user/logout";
import { EditProfile } from "../pages/user/me.page";
import { UpdatePassword } from "../pages/user/password.page";
import { VerificationPage } from "../pages/user/verification.page";
import { CreateDish } from "../pages/restaurant/create.dish";
import { UpdateRestaurant } from "../pages/restaurant/update.restaurant";

import { Order } from "../pages/order";
import { DashBoard } from "../pages/driver/dashboard";
import { MyPage } from "../pages/my.page";
import { TOKEN_NAME } from "../gloabl.constant";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { useApolloClient } from "@apollo/client";
import { SetAddress } from "../pages/user/set.address";

interface IRouteItem {
  path: string;
  component: React.FC;
  exact?: boolean;
}

const clientRoutes: IRouteItem[] = [
  {
    path: "/",
    component: RestaurantsPage,
    exact: true,
  },
  {
    path: "/search",
    component: SearchPage,
  },
  {
    path: "/category/:slug",
    component: CategoryPage,
  },
  {
    path: "/restaurant/:id",
    component: Restaurant,
  },
];

const ownerRoutes: IRouteItem[] = [
  {
    path: "/",
    component: MyRestaurants,
    exact: true,
  },
  {
    path: "/create-restaurant",
    component: CreateRestaurant,
  },
  {
    path: "/my-restaurant/:restaurantId/:dishId/update",
    component: CreateDish,
    exact: true,
  },
  {
    path: "/my-restaurant/:restaurantId/create-dish",
    component: CreateDish,
  },
  {
    path: "/my-restaurant/:id/update",
    component: UpdateRestaurant,
  },
  {
    path: "/my-restaurant/:id",
    component: MyRestaurant,
  },
];

const driversRoutes: IRouteItem[] = [{ path: "/", component: DashBoard }];

const commonRoutes: IRouteItem[] = [
  {
    path: "/verification",
    component: VerificationPage,
  },
  {
    path: "/me",
    component: EditProfile,
  },
  {
    path: "/password",
    component: UpdatePassword,
  },
  {
    path: "/logout",
    component: LogOutPage,
  },
  {
    path: "/orders/:id",
    component: Order,
  },
  {
    path: "/my-page",
    component: MyPage,
  },
  {
    path: "/my-address",
    component: SetAddress,
  },
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  const client = useApolloClient();

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }

  if (!loading && error) {
    localStorage.removeItem(TOKEN_NAME);
    isLoggedInVar(false);
    authTokenVar(null);
    client.cache.reset();
  }

  return (
    <Router>
      <Header />
      <Switch>
        {commonRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            exact={Boolean(route.exact)}
          >
            <route.component />
          </Route>
        ))}
        {data?.me?.role === UserRole.Client &&
          clientRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              exact={Boolean(route.exact)}
            >
              <route.component />
            </Route>
          ))}
        {data?.me?.role === UserRole.Owner &&
          ownerRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              exact={Boolean(route.exact)}
            >
              <route.component />
            </Route>
          ))}
        {data?.me?.role === UserRole.Delivery &&
          driversRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              exact={Boolean(route.exact)}
            >
              <route.component />
            </Route>
          ))}

        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
