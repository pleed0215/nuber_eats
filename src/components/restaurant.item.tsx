import React from "react";
import { Link } from "react-router-dom";
import { QueryRestaurants_allRestaurants_restaurants } from "../codegen/QueryRestaurants";

interface IRestaurantItem {
  restaurant: QueryRestaurants_allRestaurants_restaurants | null | undefined;
  linkPrefix?: string;
  categoryShow?: boolean;
}

export const RestaurantItem: React.FC<IRestaurantItem> = ({
  restaurant,
  linkPrefix,
  categoryShow = true,
}) => (
  <div className="">
    <Link to={`/${linkPrefix ? linkPrefix : "restaurant"}/${restaurant?.id}`}>
      <div
        className="py-28 bg-cover bg-center border border-gray-100 rounded-md"
        style={{ backgroundImage: `url(${restaurant?.coverImage})` }}
      ></div>
      <h3 className="text-xl font-medium border-b border-gray-400 pb-2 mb-3">
        {restaurant?.name}
      </h3>
    </Link>
    {categoryShow && restaurant?.category?.name && (
      <Link to={`/category/${restaurant?.category?.slug}`}>
        <span className="px-2 py-1 bg-lime-600 text-md text-white rounded-xl">
          {restaurant?.category?.name}
        </span>
      </Link>
    )}
  </div>
);
