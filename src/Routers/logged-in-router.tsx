import { gql, useQuery } from "@apollo/client";
import React from "react";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { TOKEN_NAME } from "../gloabl.constant";

const GQL_QUERY_ME = gql`
  query QueryMe {
    me {
      id
      email
      role
      verified
    }
  }
`;

export const LoggedInRouter = () => {
  const { data, loading, error } = useQuery(GQL_QUERY_ME);

  if (loading) {
    <div className="h-screen flex justify-center items-center">
      <span className="font-medium text-xl tracking-wide">Loading...</span>
    </div>;
  }

  if (error) {
    console.log(error);
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">
          {error.toString()}
        </span>
      </div>
    );
  } else {
    return (
      <div>
        <h1>{data?.me.email}</h1>
        <button
          onClick={() => {
            isLoggedInVar(false);
            authTokenVar(null);
            localStorage.removeItem(TOKEN_NAME);
          }}
        >
          Logout
        </button>
      </div>
    );
  }
};
