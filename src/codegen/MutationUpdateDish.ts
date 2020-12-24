/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DishOptionType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: MutationUpdateDish
// ====================================================

export interface MutationUpdateDish_updateDish {
  __typename: "UpdateDishOutput";
  ok: boolean;
  error: string | null;
}

export interface MutationUpdateDish {
  updateDish: MutationUpdateDish_updateDish;
}

export interface MutationUpdateDishVariables {
  name?: string | null;
  price?: number | null;
  description?: string | null;
  options?: DishOptionType[] | null;
  dishId: number;
}
