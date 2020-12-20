/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateRestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: MutationCreateRestaurant
// ====================================================

export interface MutationCreateRestaurant_createRestaurant_restaurant_category {
  __typename: "Category";
  id: number;
  name: string;
  slug: string;
}

export interface MutationCreateRestaurant_createRestaurant_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImage: string;
  category: MutationCreateRestaurant_createRestaurant_restaurant_category | null;
  address: string;
  isPromoted: boolean;
}

export interface MutationCreateRestaurant_createRestaurant {
  __typename: "CreateRestaurantOutput";
  error: string | null;
  ok: boolean;
  restaurant: MutationCreateRestaurant_createRestaurant_restaurant | null;
}

export interface MutationCreateRestaurant {
  createRestaurant: MutationCreateRestaurant_createRestaurant;
}

export interface MutationCreateRestaurantVariables {
  input: CreateRestaurantInput;
}
