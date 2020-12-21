/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: QueryMyRestaurant
// ====================================================

export interface QueryMyRestaurant_restaurant_restaurant_category {
  __typename: "Category";
  id: number;
  name: string;
  slug: string;
}

export interface QueryMyRestaurant_restaurant_restaurant_dishes_options_choices {
  __typename: "DishChoiceOption";
  name: string;
  extra: number | null;
}

export interface QueryMyRestaurant_restaurant_restaurant_dishes_options {
  __typename: "DishOption";
  name: string;
  extra: number | null;
  choices: QueryMyRestaurant_restaurant_restaurant_dishes_options_choices[] | null;
}

export interface QueryMyRestaurant_restaurant_restaurant_dishes {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
  photo: string | null;
  description: string;
  options: QueryMyRestaurant_restaurant_restaurant_dishes_options[] | null;
}

export interface QueryMyRestaurant_restaurant_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImage: string;
  category: QueryMyRestaurant_restaurant_restaurant_category | null;
  address: string;
  isPromoted: boolean;
  dishes: QueryMyRestaurant_restaurant_restaurant_dishes[] | null;
}

export interface QueryMyRestaurant_restaurant {
  __typename: "RestaurantDetailOutput";
  ok: boolean;
  error: string | null;
  restaurant: QueryMyRestaurant_restaurant_restaurant | null;
}

export interface QueryMyRestaurant {
  restaurant: QueryMyRestaurant_restaurant;
}

export interface QueryMyRestaurantVariables {
  id: number;
}
