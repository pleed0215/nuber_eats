import { gql, useQuery } from "@apollo/client";
import React from "react";
import { QueryMyRestaurants } from "../../codegen/QueryMyRestaurants";
import { RESTAURANT_FRAGMENT } from "../../fragments";

const GQL_MYRESTAURANTS = gql`
  query QueryMyRestaurants {
    myRestaurants {
      ok
      error
      count
      restaurants {
        ...RestaurantPart
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const MyRestaurant = () => {
  const { data, loading } = useQuery<QueryMyRestaurants>(GQL_MYRESTAURANTS);

  return (
    <div>
      {loading ? (
        <div>Loading</div>
      ) : (
        data?.myRestaurants?.restaurants?.map((r) => (
          <div key={r.id}>{r.name}</div>
        ))
      )}
    </div>
  );
};
