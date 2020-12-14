import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  QuerySearchByTerm,
  QuerySearchByTermVariables,
} from "../../codegen/QuerySearchByTerm";
import { HelmetOnlyTitle } from "../../components/helmet.onlytitle";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { useQueryParam } from "../../hooks/useQueryParam";

const GQL_SEARCH_BY_TERM = gql`
  query QuerySearchByTerm($term: String!, $page: Int!) {
    searchRestaurantByName(search: { query: $term, page: $page }) {
      ok
      error
      totalPages
      countTotalItems
      restaurants {
        ...RestaurantPart
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const SearchPage: React.FC = () => {
  const queryParam = useQueryParam();
  const history = useHistory();
  const [term, setTerm] = useState<string | null>(null);
  const [queryReadyToStart, { loading, data, error }] = useLazyQuery<
    QuerySearchByTerm,
    QuerySearchByTermVariables
  >(GQL_SEARCH_BY_TERM);

  useEffect(() => {
    const inputTerm = queryParam.get("term");
    if (!inputTerm) {
      history.replace("/");
    } else {
      queryReadyToStart({
        variables: {
          term: inputTerm,
          page: 1,
        },
      });
      setTerm(inputTerm);
      console.log(loading, data, error);
    }
  }, [loading]);

  return (
    <div>
      <HelmetOnlyTitle title={`Searching ${term}`} />
      <h1>{term}</h1>
    </div>
  );
};
