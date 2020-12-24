/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateRestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: MutationUpdateRestaurant
// ====================================================

export interface MutationUpdateRestaurant_updateRestaurant {
  __typename: "UpdateRestaurantOutput";
  error: string | null;
  ok: boolean;
}

export interface MutationUpdateRestaurant {
  updateRestaurant: MutationUpdateRestaurant_updateRestaurant;
}

export interface MutationUpdateRestaurantVariables {
  input: UpdateRestaurantInput;
}
