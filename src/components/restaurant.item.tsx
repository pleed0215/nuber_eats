import React from "react";
import { QueryRestaurants_allRestaurants_restaurants } from "../codegen/QueryRestaurants";

interface IRestaurantItem {
  restaurant: QueryRestaurants_allRestaurants_restaurants | null | undefined;
}

export const RestaurantItem: React.FC<IRestaurantItem> = ({ restaurant }) => (
  <div className="">
    <div
      className="py-28 bg-cover border border-gray-100"
      style={{ backgroundImage: `url(${restaurant?.coverImage})` }}
    ></div>
    <h3 className="text-xl font-medium border-b border-gray-400 pb-2 mb-3">
      {restaurant?.name}
    </h3>
    <span className="px-2 py-1 bg-lime-600 text-md text-white rounded-xl">
      {restaurant?.category?.name}
    </span>
  </div>
);
