/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateRestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: MutationCreateRestaurant
// ====================================================

export interface MutationCreateRestaurant_createRestaurant {
  __typename: "CreateRestaurantOutput";
  error: string | null;
  ok: boolean;
}

export interface MutationCreateRestaurant {
  createRestaurant: MutationCreateRestaurant_createRestaurant;
}

export interface MutationCreateRestaurantVariables {
  input: CreateRestaurantInput;
}
