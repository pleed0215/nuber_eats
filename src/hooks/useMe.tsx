import { gql, useQuery } from "@apollo/client";

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
  return useQuery(GQL_QUERY_ME);
};
