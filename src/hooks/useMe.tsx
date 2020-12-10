import { gql, useQuery } from "@apollo/client";
import { QueryMe } from "../codegen/QueryMe";

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

export const useMe = () => {
  return useQuery<QueryMe>(GQL_QUERY_ME);
};
