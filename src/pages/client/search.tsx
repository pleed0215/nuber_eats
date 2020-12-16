import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  QuerySearchByTerm,
  QuerySearchByTermVariables,
} from "../../codegen/QuerySearchByTerm";
import { HelmetOnlyTitle } from "../../components/helmet.onlytitle";
import { Restaurants } from "../../components/restaurants";
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
        category {
          name
          slug
        }
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
    }
  }, [loading]);

  return (
    <div>
      <HelmetOnlyTitle title={`Searching term: "${term}"`} />
      <div className="w-full">
        {loading ? (
          <h1>Loading...</h1>
        ) : (
          <Restaurants
            restaurants={data?.searchRestaurantByName.restaurants}
            categoryShow={true}
            title={`Searching: "${term}" (Found: ${data?.searchRestaurantByName.countTotalItems})`}
          />
        )}
      </div>
    </div>
  );
};
