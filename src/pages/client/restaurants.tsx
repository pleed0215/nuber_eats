import { gql, useQuery } from "@apollo/client";
import {
  QueryRestaurants,
  QueryRestaurantsVariables,
} from "../../codegen/QueryRestaurants";
import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { HelmetOnlyTitle } from "../../components/helmet.onlytitle";
import { Categories } from "../../components/categories";
import { Restaurants } from "../../components/restaurants";

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

interface ISearchForm {
  searchTerm: string;
}

export const RestaurantsPage = () => {
  const history = useHistory();
  const { register, handleSubmit, getValues } = useForm<ISearchForm>();
  const { data, loading, error } = useQuery<
    QueryRestaurants,
    QueryRestaurantsVariables
  >(GQL_RESTAURANTS, { variables: { page: 1 } });

  const onSubmit = ({ searchTerm }: ISearchForm) => {
    history.push({
      pathname: "/search",
      search: `?term=${searchTerm}`,
    });
  };

  return (
    <div className="w-full">
      <HelmetOnlyTitle title="Restaurants.." />
      <form
        className="w-full py-40 flex items-center justify-center bg-gray-800"
        action="search"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          type="search"
          name="searchTerm"
          ref={register({ required: true, minLength: 3 })}
          className="form_input w-5/12 sm:w-1/2 rounded-md"
          placeholder="Search restaurants..."
        />
      </form>
      <div className="layout__container flex flex-col justify-center items-center mt-10">
        {!loading && (
          <>
            <Categories categories={data?.allCategories.categories} />
            <Restaurants restaurants={data?.allRestaurants.restaurants} />
          </>
        )}
      </div>
    </div>
  );
};
