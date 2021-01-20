import { gql, useQuery } from "@apollo/client";
import { QueryMe } from "../codegen/QueryMe";

export const GQL_QUERY_ME = gql`
  query QueryMe {
    me {
      id
      email
      role
      address
      verified
    }
  }
`;

export const useMe = () => {
  return useQuery<QueryMe>(GQL_QUERY_ME);
};
