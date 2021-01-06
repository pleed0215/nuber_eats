import { gql, useMutation, useQuery } from "@apollo/client";
import {
  faCalculator,
  faCartArrowDown,
  faCartPlus,
  faDoorOpen,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
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
import { CreateOrderItemInput } from "../../codegen/globalTypes";
import { CartIcon } from "../../components/cart.icon";
import { toast } from "react-toastify";

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
      orderId
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
  const history = useHistory();
  const [
    dishInfo,
    setDishInfo,
  ] = useState<QueryRestaurant_restaurant_restaurant_dishes | null>(null);
  const [totalPay, setTotalPay] = useState<number>(0);
  const [options, setOptions] = useState<IOption[]>([]);
  const [totalOrder, setTotalOrder] = useState<CreateOrderItemInput[]>([]);
  const [totalOrderPay, setTotalOrderPay] = useState<number>(0);
  const [seeCart, setSeeCart] = useState<boolean>(false);
  const [nowOrdering, setNowOrdering] = useState<boolean>(false);
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
  >(GQL_ORDER, {
    onCompleted: ({ createOrder: { ok, orderId } }: MutationCreateOrder) => {
      if (ok) {
        console.log(createOrder);
        setNowOrdering(false);
        setSeeCart(false);
        toast.success(
          "You order was successfully made. Please wait for your delivery."
        );
        history.push(`/orders/${orderId}`);
      }
    },
    onError: (error) => {
      toast.error("Order failed...");
    },
  });

  const onDishClicked = (id) => {
    const dish = data?.restaurant.restaurant?.dishes?.find(
      (dish) => dish.id === id
    );
    if (dish !== undefined) {
      window.scrollTo(0, 0);
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

        setOptions([...options]);
        setTotalPay((current) => current - extra);
      } else {
        if (options[optionIndex].choices) {
          options[optionIndex].choices?.push({ name: choiceName, extra });
        } else {
          options[optionIndex].choices = [{ name: choiceName, extra }];
        }
        setOptions([...options]);
        setTotalPay((current) => current + extra);
      }
    }
  };

  const onOrderClosed = () => {
    setDishInfo(null);
    setTotalPay(0);
    setOptions([]);
    setNowOrdering(false);
  };

  const onAddCartClicked = (dishId) => {
    const order: CreateOrderItemInput = {
      dishId,
      options: [...options],
    };
    setTotalOrder([...totalOrder, order]);
    setTotalOrderPay((current) => current + totalPay);
    onOrderClosed();
  };

  const startOrder = async () => {
    if (nowOrdering || loadingCreateOrder) {
      return;
    }
    setNowOrdering(true);
    const ok = window.confirm("Are you sure order?");
    if (ok) {
      await createOrder({
        variables: {
          input: {
            restaurantId: +id,
            items: totalOrder,
          },
        },
      });
    } else {
      setNowOrdering(false);
    }
  };

  const hasOption = (optionName) => {
    return Boolean(options.find((option) => option.name === optionName));
  };

  const hasChoice = (optionName, choiceName) => {
    const option = options.find((o) => o.name === optionName);
    if (option) {
      return Boolean(
        option.choices?.find((choice) => choice.name === choiceName)
      );
    } else {
      return false;
    }
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
          <div className="layout__container flex justify-start items-center pt-5">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setSeeCart(totalOrder.length > 0 && true)}
            >
              <CartIcon n={totalOrder.length} />
              <span className="ml-2 text-lg">Total: ${totalOrderPay}</span>
            </div>
          </div>
          <div className="text-2xl italic border-b pb-2 w-full layout__container mt-4">
            Choose Dishes you want to order
          </div>
          <div className="layout__container grid lg:grid-cols-3 md:grid-cols-2  sm:grid-cols-1 gap-4 mt-4">
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
          {seeCart && (
            <div className="absolute inset-0 w-full h-full bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center">
              <div className="flex flex-col w-1/3 min-w-max max-w-sm h-1/2 border border-gray-600 rounded-lg">
                <div className="w-full h-12 bg-lime-600 rounded-t-lg text-center flex items-center justify-between text-white text-xl font-semibold italic px-4">
                  <p></p>
                  <p>Confirm orders</p>
                  <p>
                    <FontAwesomeIcon
                      icon={faDoorOpen}
                      className="hover:text-gray-300 cursor-pointer"
                      onClick={() => setSeeCart(false)}
                    />
                  </p>
                </div>
                <div className="h-full bg-white p-4 flex flex-col items-center justify-start overflow-y-auto">
                  <div className="text-md font-thin font-mono w-full">
                    Total orders
                    <hr></hr>
                  </div>
                  {totalOrder.map((order, index) => {
                    const dish = data.restaurant.restaurant?.dishes?.find(
                      (d) => d.id === order.dishId
                    );

                    return (
                      <div key={`confirm-order-${index}`} className="w-full">
                        <div className="font-mono text-sm pl-2">
                          {`# ${index + 1} - ${dish?.name} / $${dish?.price}`}
                          {order.options !== null &&
                            order.options?.map((option, optionIndex) => (
                              <div
                                className="font-mono text-sm font-thin pl-4"
                                key={`confir-option-${optionIndex}`}
                              >
                                {`@ Option ${optionIndex + 1}. ${
                                  option?.name
                                } - $${option?.extra}`}
                                {option.choices &&
                                  option.choices.length > 0 && (
                                    <div>&lt;Additional&gt;</div>
                                  )}
                                {option?.choices?.map((choice, choiceIndex) => (
                                  <div
                                    className="font-mono text-sm font-thin pl-4"
                                    key={`confir-choice-${index}-${choiceIndex}`}
                                  >{`* ${choiceIndex + 1}. ${choice?.name} - $${
                                    choice?.extra
                                  }`}</div>
                                ))}
                              </div>
                            ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div
                  onClick={() => startOrder()}
                  className="w-full h-12 grid grid-cols-3 items-center text-white bg-lime-600 rounded-b-lg cursor-pointer hover:bg-lime-700  transition duration-200"
                >
                  <p className="text-center">
                    <FontAwesomeIcon icon={faCalculator} className="mr-2" />
                    Total: ${totalOrderPay}
                  </p>
                  <p className="text-center">
                    {nowOrdering ? "Ordering ...." : "Order Now"}
                  </p>
                  <p></p>
                </div>
              </div>
            </div>
          )}
          {dishInfo && (
            <div className="absolute inset-0 w-full h-full bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center">
              <div className="flex flex-col w-1/3 min-w-max max-w-sm h-1/2 border border-gray-600 rounded-lg">
                <div className="w-full h-12 bg-lime-600 rounded-t-lg text-center flex items-center justify-between text-white text-xl font-semibold italic px-4">
                  <p></p>
                  <p className="truncate">Order for '{dishInfo.name}'</p>
                  <p
                    className="hover:text-gray-200 cursor-pointer"
                    onClick={() => onOrderClosed()}
                  >
                    <FontAwesomeIcon icon={faDoorOpen} />
                  </p>
                </div>
                <div className="h-full bg-white p-4 flex flex-col items-center justify-start overflow-y-auto">
                  <div className="flex w-full h-auto">
                    <div
                      className=" w-32 h-32 bg-center bg-cover rounded"
                      style={{ backgroundImage: `url(${dishInfo.photo})` }}
                    ></div>
                    <div className="w-full ml-2">
                      <div
                        onClick={() => onAddCartClicked(dishInfo.id)}
                        className="px-2 py-1 text-center bg-blue-400 text-blue-600 hover:bg-blue-600 hover:text-white transition duration-200 rounded-md cursor-pointer"
                      >
                        <FontAwesomeIcon
                          icon={faCartArrowDown}
                          className="mr-2"
                        />
                        Add to Cart
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
                            <div
                              className={`flex items-center border px-2 py-1 cursor-pointer rounded-lg mb-2 ${
                                hasOption(option.name)
                                  ? " border-gray-600 shadow bg-lime-200"
                                  : "border-gray-200"
                              }`}
                              onClick={() =>
                                onOptionClicked(option.name, option.extra)
                              }
                            >
                              <span>
                                {option.name} -
                                {option.extra === 0
                                  ? "free"
                                  : `$${option.extra}`}
                              </span>
                            </div>
                            {option.choices && option.choices.length > 0 && (
                              <div className="ml-4 border p-2 flex flex-col text-sm mb-2">
                                <span className="mb-1 font-semibold">
                                  Choose extra option
                                </span>
                                {option.choices &&
                                  option.choices.map((choice, choiceIndex) => (
                                    <div
                                      key={`option-${choice}-${choiceIndex}`}
                                      className={`px-2 py-1 border rounded-lg mb-1 cursor-pointer ${
                                        hasChoice(option.name, choice.name)
                                          ? "border-gray-600 shadow bg-lime-200"
                                          : "border-gray-200"
                                      }`}
                                      onClick={() =>
                                        onChoiceClicked(
                                          option.name,
                                          choice.name,
                                          choice.extra
                                        )
                                      }
                                    >
                                      <div className="ml-2 flex items-center">
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
