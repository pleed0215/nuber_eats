/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL fragment: OrderPart
// ====================================================

export interface OrderPart_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
  address: string;
}

export interface OrderPart_driver {
  __typename: "User";
  id: number;
  email: string;
}

export interface OrderPart_customer {
  __typename: "User";
  id: number;
  email: string;
  address: string | null;
}

export interface OrderPart_orderItems_dish {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
}

export interface OrderPart_orderItems_options_choices {
  __typename: "DishChoiceOption";
  name: string;
  extra: number | null;
}

export interface OrderPart_orderItems_options {
  __typename: "OrderItemOption";
  extra: number | null;
  name: string;
  choices: OrderPart_orderItems_options_choices[] | null;
}

export interface OrderPart_orderItems {
  __typename: "OrderItem";
  dish: OrderPart_orderItems_dish;
  options: OrderPart_orderItems_options[] | null;
}

export interface OrderPart {
  __typename: "Order";
  id: number;
  createAt: any;
  totalCost: number | null;
  restaurant: OrderPart_restaurant | null;
  orderStatus: OrderStatus;
  driver: OrderPart_driver | null;
  customer: OrderPart_customer | null;
  orderItems: OrderPart_orderItems[] | null;
}
