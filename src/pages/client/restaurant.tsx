import { gql, useQuery } from "@apollo/client";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  QueryRestaurant,
  QueryRestaurantVariables,
} from "../../codegen/QueryRestaurant";
import { DishItem } from "../../components/dish.item";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";

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
        dishes {
          ...DishPart
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
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

  if (data) console.log(data);
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
            <div className="sm:w-2/3 md:w-1/2 xl:w-1/3 bg-white py-4 pr-4 opacity-95">
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
          <div className="layout__container grid lg:grid-cols-3 md:grid-cols-2  sm:grid-cols-1 gap-4 mt-10">
            {data?.restaurant.restaurant?.dishes?.map((dish) => (
              <DishItem
                key={dish.id}
                name={dish.name}
                price={dish.price}
                description={dish.description}
                photo={dish.photo}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
