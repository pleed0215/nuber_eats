import { gql } from "@apollo/client";
import React from "react";

const GQL_CREATE_ACCOUNT = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ok
      error
    }
  }
`;

export const CreateAccountPage = () => {
  return (
    <div>
      <h1>CreateAccountPage</h1>
    </div>
  );
};
