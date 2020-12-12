import { gql, useQuery } from "@apollo/client";
import {
  QueryRestaurants,
  QueryRestaurantsVariables,
} from "../../codegen/QueryRestaurants";
import React from "react";
import { CategoryItem } from "../../components/category";

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
    <div className="w-full">
      <form className="w-full py-40 flex items-center justify-center bg-gray-800">
        <input
          type="search"
          className="form_input w-3/12 sm:w-1/2 rounded-md"
          placeholder="Search restaurants..."
        />
      </form>
      <div className="layout__container flex flex-col justify-center items-center mt-10">
        {!loading && (
          <>
            <div className="w-full flex justify-around items-center">
              {data?.allCategories.categories?.map((category) => (
                <CategoryItem
                  key={category.name}
                  width={14}
                  height={14}
                  image={category.image}
                  name={category.name}
                />
              ))}
            </div>
            <div className="w-full grid grid-cols-3 gap-4 mt-8">
              {data?.allRestaurants.restaurants?.map((restaurant) => (
                <div key={restaurant.name} className="bg-red-500">
                  {restaurant.name}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
