import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import {
  QueryCategory,
  QueryCategoryVariables,
} from "../../codegen/QueryCategory";
import { HelmetOnlyTitle } from "../../components/helmet.onlytitle";
import { Restaurants } from "../../components/restaurants";

import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";

interface IParams {
  slug: string;
}

const GQL_QUERY_CATEGORY = gql`
  query QueryCategory($page: Int, $slug: String!) {
    category(slug: $slug, page: $page) {
      ok
      error
      totalPages
      currentPage
      countTotalItems
      category {
        ...CategoryPart
      }
      restaurants {
        ...RestaurantPart
        category {
          id
          name
          slug
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

export const CategoryPage = () => {
  const { slug } = useParams<IParams>();
  const { data, error, loading } = useQuery<
    QueryCategory,
    QueryCategoryVariables
  >(GQL_QUERY_CATEGORY, {
    variables: {
      slug,
    },
  });

  return (
    <div className="w-full">
      <HelmetOnlyTitle title={`Category:`} />
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <Restaurants
          restaurants={data?.category.restaurants}
          categoryShow={false}
          title={`Category: ${data?.category.category?.name}`}
        />
      )}
    </div>
  );
};
