import { gql, useMutation, useQuery } from "@apollo/client";
import {
  faCartArrowDown,
  faCartPlus,
  faDoorClosed,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  MutationCreateOrder,
  MutationCreateOrderVariables,
} from "../../codegen/MutationCreateOrder";
import {
  QueryRestaurant,
  QueryRestaurantVariables,
  QueryRestaurant_restaurant_restaurant_dishes,
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
  mutation MutationCreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
    }
  }
`;

interface IChoice {
  name: string;
  extra: number;
}

interface IOption {
  name: string;
  extra: number;
  choices?: IChoice[] | null;
}

export const Restaurant = () => {
  const { id } = useParams<IParam>();
  const [
    dishInfo,
    setDishInfo,
  ] = useState<QueryRestaurant_restaurant_restaurant_dishes | null>(null);
  const [totalPay, setTotalPay] = useState<number>(0);
  const [options, setOptions] = useState<IOption[]>([]);
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
    const dish = data?.restaurant.restaurant?.dishes?.find(
      (dish) => dish.id === id
    );
    if (dish !== undefined) {
      setDishInfo(dish);
      setTotalPay(dish.price);
    }
  };

  const onOptionClicked = (name, extra) => {
    const option = options?.find((option) => option.name === name);
    if (option) {
      let choicesPay = 0;
      option.choices?.forEach((choice) => (choicesPay += choice.extra));
      setOptions(options.filter((option) => option.name !== name));
      setTotalPay((current) => current - extra - choicesPay);
    } else {
      if (options) {
        setOptions([...options, { name, extra }]);
        setTotalPay((current) => current + extra);
      }
    }
  };

  const onChoiceClicked = (optionName, choiceName, extra) => {
    const optionIndex = options?.findIndex(
      (option) => option.name === optionName
    );
    if (optionIndex > -1) {
      const choiceIndex = options[optionIndex].choices?.findIndex(
        (choice) => choice.name === choiceName
      );

      if (choiceIndex !== undefined && choiceIndex > -1) {
        options[optionIndex].choices?.splice(choiceIndex, 1);
        console.log("if choice", options);
        setOptions([...options]);
        setTotalPay((current) => current - extra);
      } else {
        if (options[optionIndex].choices) {
          options[optionIndex].choices?.push({ name: choiceName, extra });
        } else {
          options[optionIndex].choices = [{ name: choiceName, extra }];
        }
        console.log("if choice is null", options);
        setOptions([...options]);
        setTotalPay((current) => current + extra);
      }
    }
  };

  const onOrderClosed = () => {
    setDishInfo(null);
    setTotalPay(0);
    setOptions([]);
  };

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
          {dishInfo && (
            <div className="absolute inset-0 w-full h-full bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center">
              <div className="flex flex-col w-1/3 max-w-sm h-1/2 border border-gray-600 rounded-lg">
                <div className="w-full h-12 bg-lime-600 rounded-t-lg text-center flex items-center justify-between text-white text-xl font-semibold italic px-4">
                  <p></p>
                  <p className="truncate">Order for '{dishInfo.name}'</p>
                  <p
                    className="hover:text-gray-200 cursor-pointer"
                    onClick={() => onOrderClosed()}
                  >
                    <FontAwesomeIcon icon={faDoorClosed} />
                  </p>
                </div>
                <div className="h-full bg-white p-4 flex flex-col items-center justify-start overflow-y-auto">
                  <div className="flex w-full h-auto">
                    <div
                      className=" w-32 h-32 bg-center bg-cover rounded"
                      style={{ backgroundImage: `url(${dishInfo.photo})` }}
                    ></div>
                    <div className="w-full ml-2">
                      <div className="px-2 py-1 text-center bg-blue-400 text-blue-600 hover:bg-blue-600 hover:text-white transition duration-200 rounded-md cursor-pointer">
                        Order
                      </div>
                      <div className="text-xl font-bold ">{dishInfo.name}</div>
                      <div className="text-xs font-thin mb-2">
                        {dishInfo.description}
                      </div>
                      <div className=" text-sm">Price: ${dishInfo.price}</div>
                    </div>
                  </div>
                  {dishInfo.options && dishInfo.options.length > 0 && (
                    <div className="w-full mt-2 border-t  border-gray-300 pt-2 px-2 flex flex-col">
                      <div className="text-xl font-semibold mb-2">
                        Select Options &amp; Choices
                      </div>
                      {dishInfo.options &&
                        dishInfo.options.map((option, index) => (
                          <div
                            key={`option-${index}`}
                            className="flex flex-col"
                          >
                            <div className="flex items-center">
                              <input
                                name={`option-${index}`}
                                id={`option-${index}`}
                                type="checkbox"
                                onClick={() =>
                                  onOptionClicked(option.name, option.extra)
                                }
                                className="mr-2"
                              />
                              <span>
                                {option.name} -
                                {option.extra === 0
                                  ? "free"
                                  : `$${option.extra}`}
                              </span>
                            </div>
                            {option.choices && option.choices.length > 0 && (
                              <div className="ml-4 border p-2 flex flex-col text-sm">
                                <span className="mb-1 font-semibold">
                                  Choose extra option
                                </span>
                                {option.choices &&
                                  option.choices.map((choice, choiceIndex) => (
                                    <div
                                      key={`option-${choice}-${choiceIndex}`}
                                    >
                                      <div className="ml-2 flex items-center">
                                        <input
                                          name={`option-${index}-${choiceIndex}`}
                                          id={`option-${index}-${choiceIndex}`}
                                          type="checkbox"
                                          onClick={() =>
                                            onChoiceClicked(
                                              option.name,
                                              choice.name,
                                              choice.extra
                                            )
                                          }
                                          className="mr-2"
                                        />
                                        <span>
                                          {choice.name} -
                                          {choice.extra === 0
                                            ? "free"
                                            : `$${choice.extra}`}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                <div className="w-full h-12 flex justify-center items-center text-white bg-lime-600 rounded-b-lg">
                  <FontAwesomeIcon icon={faCartPlus} className="mr-2" />
                  Total: ${totalPay}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
