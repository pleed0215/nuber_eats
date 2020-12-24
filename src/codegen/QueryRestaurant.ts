/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: QueryRestaurant
// ====================================================

export interface QueryRestaurant_restaurant_restaurant_category {
  __typename: "Category";
  id: number;
  name: string;
  slug: string;
}

export interface QueryRestaurant_restaurant_restaurant_dishes_options_choices {
  __typename: "DishChoiceOption";
  name: string;
  extra: number | null;
}

export interface QueryRestaurant_restaurant_restaurant_dishes_options {
  __typename: "DishOption";
  name: string;
  extra: number | null;
  choices: QueryRestaurant_restaurant_restaurant_dishes_options_choices[] | null;
}

export interface QueryRestaurant_restaurant_restaurant_dishes {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
  photo: string | null;
  description: string;
  options: QueryRestaurant_restaurant_restaurant_dishes_options[] | null;
}

export interface QueryRestaurant_restaurant_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImage: string;
  category: QueryRestaurant_restaurant_restaurant_category | null;
  address: string;
  isPromoted: boolean;
  dishes: QueryRestaurant_restaurant_restaurant_dishes[] | null;
}

export interface QueryRestaurant_restaurant {
  __typename: "RestaurantDetailOutput";
  ok: boolean;
  error: string | null;
  restaurant: QueryRestaurant_restaurant_restaurant | null;
}

export interface QueryRestaurant {
  restaurant: QueryRestaurant_restaurant;
}

export interface QueryRestaurantVariables {
  id: number;
}
