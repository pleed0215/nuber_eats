import { gql, useQuery } from "@apollo/client";
import {
  QueryRestaurants,
  QueryRestaurantsVariables,
} from "../../codegen/QueryRestaurants";
import React from "react";

// backend에 page를 Number로 주는 바람에... page type이 Float이다.. 나중에 수정해야 한다.
const GQL_RESTAURANTS = gql`
  query QueryRestaurants($page: Float!) {
    allCategories {
      ok
      error
      count
      categories {
        id
        name
        image
        slug
        restaurants {
          name
        }
      }
    }
    allRestaurants(page: $page) {
      ok
      error
      totalPages
      currentPage
      countTotalItems
      restaurants {
        id
        name
        coverImage
        address
        isPromoted
        category {
          name
        }
      }
    }
  }
`;

export const Restaurants = () => {
  const { data, loading, error } = useQuery<
    QueryRestaurants,
    QueryRestaurantsVariables
  >(GQL_RESTAURANTS, { variables: { page: 1 } });

  return (
    <div>
      <div className="w-full py-40 flex items-center justify-center bg-gray-800">
        <input
          type="search"
          className="form_input w-3/12 sm:w-1/2 rounded-md"
          placeholder="Search restaurants..."
        />
      </div>
      <div>
        <h1>Restaurant</h1>
      </div>
    </div>
  );
};
