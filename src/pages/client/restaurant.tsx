import { gql, useQuery } from "@apollo/client";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  QueryRestaurant,
  QueryRestaurantVariables,
} from "../../codegen/QueryRestaurant";
import { RESTAURANT_FRAGMENT } from "../../fragments";

interface IParam {
  id: string;
}

export const GQL_RESTAURANT = gql`
  query QueryRestaurant($id: Float!) {
    restaurant(id: $id) {
      ok
      error
      restaurant {
        ...RestaurantPart
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const Restaurant = () => {
  const { id } = useParams<IParam>();
  const { data, loading, error } = useQuery<
    QueryRestaurant,
    QueryRestaurantVariables
  >(GQL_RESTAURANT, {
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
            className="w-full h-80 bg-cover bg-center flex items-center"
            style={{
              backgroundImage: `url(${data?.restaurant.restaurant?.coverImage})`,
            }}
          >
            <div className="w-1/3 bg-white py-4">
              <h1 className="text-2xl pl-20 flex mb-3 ">
                {data?.restaurant.restaurant?.name}
              </h1>
              <Link
                to={`/category/${data.restaurant.restaurant?.category?.slug}`}
              >
                <h4 className="text-sm font-light pl-20 flex mb-2 underline">
                  {data?.restaurant.restaurant?.category?.name}
                </h4>
              </Link>
              <h4 className="text-sm font-light pl-20 flex items-center">
                <FontAwesomeIcon className="mr-2" icon={faHome} />
                {data?.restaurant.restaurant?.address}
              </h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
