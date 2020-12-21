import { gql, useQuery } from "@apollo/client";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  QueryMyRestaurant,
  QueryMyRestaurantVariables,
} from "../../codegen/QueryMyRestaurant";

import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";

interface IParam {
  id: string;
}

export const GQL_MYRESTAURANT = gql`
  query QueryMyRestaurant($id: Float!) {
    restaurant(id: $id) {
      ok
      error
      restaurant {
        ...RestaurantPart
        dishes {
          ...DishPart
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

export const MyRestaurant = () => {
  const { id } = useParams<IParam>();
  const { data, loading, error } = useQuery<
    QueryMyRestaurant,
    QueryMyRestaurantVariables
  >(GQL_MYRESTAURANT, {
    variables: {
      id: +id,
    },
  });

  return (
    <div className="w-full flex justify-contern">
      {loading ? (
        <div className="w-screen h-screen flex justify-content items-center">
          <h1>Loading...</h1>
        </div>
      ) : error || !data?.restaurant.ok ? (
        <div className="w-screen h-screen flex justify-content items-center">
          <h1>Data fetching error</h1>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          <div
            className="w-full h-60 bg-cover bg-center flex items-center"
            style={{
              backgroundImage: `url(${data?.restaurant.restaurant?.coverImage})`,
            }}
          >
            <div className="w-1/3 bg-white py-4 opacity-95">
              <h1 className="text-2xl pl-20 flex mb-3 ">
                {data?.restaurant.restaurant?.name}
              </h1>

              <h4 className="text-sm font-light pl-20 flex mb-2 underline">
                {data?.restaurant.restaurant?.category?.name}
              </h4>

              <h4 className="text-sm font-light pl-20 flex items-center">
                <FontAwesomeIcon className="mr-2" icon={faHome} />
                {data?.restaurant.restaurant?.address}
              </h4>
            </div>
          </div>
          <div className="mt-5 flex justify-start layout__container">
            <Link
              to={`/my-restaurant/${id}/create-dish`}
              className="mr-8 text-white bg-gray-800 py-3 px-10 rounded-md"
            >
              Add Dish
            </Link>
            <Link
              to=""
              className="text-white bg-lime-700 py-3 px-10 rounded-md"
            >
              Buy Promotion
            </Link>
          </div>
          <div className="mt-4 layout__container">
            {data?.restaurant?.restaurant?.dishes?.length === 0 ? (
              <div>No Dishes, please create your menus.</div>
            ) : (
              <div>
                {data?.restaurant?.restaurant?.dishes?.map((dish) => (
                  <div key={dish.id}>{dish.name}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
