/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

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

export interface QueryMyRestaurant_restaurant_restaurant_orders_restaurant {
  __typename: "Restaurant";
  id: number;
}

export interface QueryMyRestaurant_restaurant_restaurant_orders_driver {
  __typename: "User";
  id: number;
  email: string;
}

export interface QueryMyRestaurant_restaurant_restaurant_orders_customer {
  __typename: "User";
  id: number;
  email: string;
}

export interface QueryMyRestaurant_restaurant_restaurant_orders_orderItems_dish {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
}

export interface QueryMyRestaurant_restaurant_restaurant_orders_orderItems_options_choice {
  __typename: "DishChoiceOption";
  name: string;
  extra: number | null;
}

export interface QueryMyRestaurant_restaurant_restaurant_orders_orderItems_options {
  __typename: "OrderItemOption";
  extra: number | null;
  name: string;
  choice: QueryMyRestaurant_restaurant_restaurant_orders_orderItems_options_choice | null;
}

export interface QueryMyRestaurant_restaurant_restaurant_orders_orderItems {
  __typename: "OrderItem";
  dish: QueryMyRestaurant_restaurant_restaurant_orders_orderItems_dish;
  options: QueryMyRestaurant_restaurant_restaurant_orders_orderItems_options[] | null;
}

export interface QueryMyRestaurant_restaurant_restaurant_orders {
  __typename: "Order";
  id: number;
  createAt: any;
  totalCost: number | null;
  restaurant: QueryMyRestaurant_restaurant_restaurant_orders_restaurant | null;
  orderStatus: OrderStatus;
  driver: QueryMyRestaurant_restaurant_restaurant_orders_driver | null;
  customer: QueryMyRestaurant_restaurant_restaurant_orders_customer | null;
  orderItems: QueryMyRestaurant_restaurant_restaurant_orders_orderItems[] | null;
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
  orders: QueryMyRestaurant_restaurant_restaurant_orders[] | null;
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
