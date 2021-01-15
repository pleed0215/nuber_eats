import { useApolloClient } from "@apollo/client";
import React from "react";
import { useHistory } from "react-router-dom";
import { authTokenVar, isLoggedInVar } from "../../apollo";
import { TOKEN_NAME } from "../../gloabl.constant";

export const LogOutPage = () => {
  const history = useHistory();
  const client = useApolloClient();

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_NAME);
    isLoggedInVar(false);
    authTokenVar(null);
    client.cache.reset().then(() => history.push("/"));
  };
  setTimeout(handleLogout, 2000);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold">Bye Bye</h1>
    </div>
  );
};
