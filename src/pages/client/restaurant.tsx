import { gql, useMutation, useQuery } from "@apollo/client";
import {
  faCartArrowDown,
  faCartPlus,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  MutationCreateOrder,
  MutationCreateOrderVariables,
} from "../../codegen/MutationCreateOrder";
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

const GQL_ORDER = gql`
  mutation MutationCreateOrder($input: CreateOrderItemInput) {
    createOrder(input: $input) {
      ok
      error
    }
  }
`;

export const Restaurant = () => {
  const { id } = useParams<IParam>();
  const [dishId, setDishId] = useState<number>(-1);
  const { data, loading, error } = useQuery<
    QueryRestaurant,
    QueryRestaurantVariables
  >(GQL_RESTAURANT, {
    variables: {
      id: +id,
    },
  });

  const [createOrder, { loading: loadingCreateOrder }] = useMutation<
    MutationCreateOrder,
    MutationCreateOrderVariables
  >(GQL_ORDER);

  const onDishClicked = (id) => {
    setDishId(id);
  };

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
              <div key={dish.id} onClick={() => onDishClicked(dish.id)}>
                <DishItem
                  name={dish.name}
                  price={dish.price}
                  description={dish.description}
                  photo={dish.photo}
                  cursorPointer
                />
              </div>
            ))}
          </div>
          {dishId >= 0 && (
            <div className="absolute inset-0 w-full h-full bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center">
              <div className="flex flex-col w-1/3 max-w-sm h-1/2 border border-gray-600 rounded-lg">
                <div className="w-full h-12 bg-lime-600 rounded-t-lg text-center flex items-center justify-center">
                  <p className="text-white text-xl font-semibold italic">
                    Start Order
                  </p>
                </div>
                <div className="h-full bg-white"></div>
                <div className="w-full h-12 flex justify-center items-center text-white bg-lime-600 rounded-b-lg">
                  <FontAwesomeIcon icon={faCartPlus} className="mr-2" />
                  Total
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
