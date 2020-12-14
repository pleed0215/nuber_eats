import React from "react";
import { QueryRestaurants_allRestaurants_restaurants } from "../codegen/QueryRestaurants";
import { RestaurantItem } from "./restaurant.item";

interface IRestaurants {
  restaurants: QueryRestaurants_allRestaurants_restaurants[] | null | undefined;
}

export const Restaurants: React.FC<IRestaurants> = ({ restaurants }) => {
  return (
    <div className="layout__container mx-auto grid lg:grid-cols-3 gap-x-5 gap-y-10 mt-8">
      {restaurants?.map((restaurant) => (
        <RestaurantItem restaurant={restaurant} />
      ))}
    </div>
  );
};
