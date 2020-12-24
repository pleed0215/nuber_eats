/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DishOptionType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: MutationUpdateDish
// ====================================================

export interface MutationUpdateDish_createDish_dish_options_choices {
  __typename: "DishChoiceOption";
  name: string;
  extra: number | null;
}

export interface MutationUpdateDish_createDish_dish_options {
  __typename: "DishOption";
  name: string;
  extra: number | null;
  choices: MutationUpdateDish_createDish_dish_options_choices[] | null;
}

export interface MutationUpdateDish_createDish_dish {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
  photo: string | null;
  description: string;
  options: MutationUpdateDish_createDish_dish_options[] | null;
}

export interface MutationUpdateDish_createDish {
  __typename: "CreateDishOutput";
  ok: boolean;
  error: string | null;
  dish: MutationUpdateDish_createDish_dish | null;
}

export interface MutationUpdateDish {
  createDish: MutationUpdateDish_createDish;
}

export interface MutationUpdateDishVariables {
  name?: string | null;
  price?: number | null;
  description?: string | null;
  options?: DishOptionType[] | null;
  dishId: number;
}
