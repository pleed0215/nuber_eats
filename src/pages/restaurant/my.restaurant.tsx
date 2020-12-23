import { gql, useQuery } from "@apollo/client";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  QueryMyRestaurant,
  QueryMyRestaurantVariables,
} from "../../codegen/QueryMyRestaurant";
import { DishItem } from "../../components/dish.item";

import {
  DISH_FRAGMENT,
  ORDER_FRAGMENT,
  RESTAURANT_FRAGMENT,
} from "../../fragments";
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryPie,
  VictoryVoronoiContainer,
  VictoryLine,
  VictoryTheme,
  VictoryLabel,
  VictoryTooltip,
} from "victory";

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
        orders {
          ...OrderPart
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDER_FRAGMENT}
`;

interface IChartData {
  x: string;
  y: number;
}

export const MyRestaurant = () => {
  const { id } = useParams<IParam>();
  let chartData: IChartData[] = [];
  const { data, loading, error } = useQuery<
    QueryMyRestaurant,
    QueryMyRestaurantVariables
  >(GQL_MYRESTAURANT, {
    variables: {
      id: +id,
    },
  });

  if (data && !loading) {
    data.restaurant?.restaurant?.orders?.forEach((order) => {
      const date = new Date(order.createAt).toLocaleDateString("ko");
      const dateIndex = chartData.findIndex((data) => data.x === date);
      if (dateIndex !== -1) {
        chartData[dateIndex].y += order.totalCost ? order.totalCost : 0;
      } else {
        chartData.push({ x: date, y: order.totalCost ? order.totalCost : 0 });
      }
    });
  }

  return (
    <div className="w-full flex flex-col items-center">
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
              <div className="w-full mx-auto grid xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-x-5 gap-y-10">
                {data?.restaurant?.restaurant?.dishes?.map((dish) => (
                  <DishItem
                    key={dish.id}
                    name={dish.name}
                    description={dish.description}
                    photo={dish.photo}
                    price={dish.price}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="mt-20 mb-20">
            <h4 className="text-center text-2xl font-medium">Sales</h4>
            <div className="w-full">
              <VictoryChart
                domainPadding={20}
                width={window.innerWidth}
                height={500}
                theme={VictoryTheme.material}
                containerComponent={<VictoryVoronoiContainer />}
              >
                <VictoryLine
                  data={chartData}
                  style={{ data: { strokeWidth: 5 } }}
                  labels={({ datum }) => `$${datum.y}`}
                  labelComponent={
                    <VictoryTooltip
                      style={{ fontSize: 10 }}
                      renderInPortal
                      dy={-20}
                    />
                  }
                  interpolation="natural"
                />

                <VictoryAxis
                  style={{
                    tickLabels: {
                      fontSize: 10,
                    },
                  }}
                />
              </VictoryChart>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};