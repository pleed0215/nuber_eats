import React from "react";
import { QueryRestaurants_allRestaurants_restaurants } from "../codegen/QueryRestaurants";
import { RestaurantItem } from "./restaurant.item";

interface IRestaurants {
  restaurants?:
    | QueryRestaurants_allRestaurants_restaurants[]
    | null
    | undefined;
  categoryShow?: boolean;
  title?: string;
}

export const Restaurants: React.FC<IRestaurants> = ({
  restaurants,
  categoryShow = true,
  title = null,
}) => {
  return (
    <div className="layout__container flex flex-col">
      {title && <h1 className="text-xl font-semibold my-4">{title}</h1>}
      <div className="layout__container mx-auto grid lg:grid-cols-3 gap-x-5 gap-y-10">
        {restaurants?.map((restaurant) => (
          <RestaurantItem
            key={restaurant.id}
            restaurant={restaurant}
            categoryShow={categoryShow}
          />
        ))}
      </div>
    </div>
  );
};
