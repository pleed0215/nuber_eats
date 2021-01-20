import { gql, useQuery } from "@apollo/client";
import {
  QueryRestaurants,
  QueryRestaurantsVariables,
} from "../../codegen/QueryRestaurants";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { HelmetOnlyTitle } from "../../components/helmet.onlytitle";
import { Categories } from "../../components/categories";
import { Restaurants } from "../../components/restaurants";
import { Loader } from "../../components/loader";
import { useMe } from "../../hooks/useMe";

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
          slug
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
  const me = useMe();
  const [page, setPage] = useState(1);
  const { register, handleSubmit } = useForm<ISearchForm>();
  const { data, loading } = useQuery<
    QueryRestaurants,
    QueryRestaurantsVariables
  >(GQL_RESTAURANTS, { variables: { page } });

  const onPrevPage = () => setPage(page > 1 ? page - 1 : 1);
  const onNextPage = () => {
    if (data?.allRestaurants.totalPages)
      setPage(
        page < data?.allRestaurants.totalPages
          ? page + 1
          : data?.allRestaurants.totalPages
      );
  };

  const onSubmit = ({ searchTerm }: ISearchForm) => {
    history.push({
      pathname: "/search",
      search: `?term=${searchTerm}`,
    });
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <HelmetOnlyTitle title="Restaurants.." />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="w-full py-40 px-20 flex flex-col items-center justify-center bg-gray-800 sm:px-20">
            <form
              className="w-full flex items-center justify-center mb-4"
              action="search"
              onSubmit={handleSubmit(onSubmit)}
            >
              <input
                type="search"
                name="searchTerm"
                ref={register({ required: true, minLength: 3 })}
                className="form_input max-w-screen-md w-full  md:max-w-screen-sm sm:max-w-screen-sm rounded-md"
                placeholder="Search restaurants..."
              />
            </form>
            <div>
              {me.data.me.address ? (
                <Link
                  to="/my-address"
                  className="text-white text-lg hover:underline"
                >
                  Delivery place: {me.data.me.address}
                </Link>
              ) : (
                <Link to="/my-address" className="text-white text-lg underline">
                  No delivery address. Click here update address.
                </Link>
              )}
            </div>
          </div>
          <div className="layout__container flex flex-col justify-center items-center mt-10">
            {!loading && data && (
              <>
                <Categories categories={data?.allCategories.categories} />
                <Restaurants restaurants={data?.allRestaurants.restaurants} />
                <div className="w-40 flex justify-between">
                  <button onClick={onPrevPage}>prev</button>
                  <span>{`${page} / ${data?.allRestaurants.totalPages}`}</span>
                  <button onClick={onNextPage}>next</button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};
