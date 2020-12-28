/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateDishInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: MutationCreateDish
// ====================================================

export interface MutationCreateDish_createDish_dish_options_choices {
  __typename: "DishChoiceOption";
  name: string;
  extra: number | null;
}

export interface MutationCreateDish_createDish_dish_options {
  __typename: "DishOption";
  name: string;
  extra: number | null;
  choices: MutationCreateDish_createDish_dish_options_choices[] | null;
}

export interface MutationCreateDish_createDish_dish {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
  photo: string | null;
  description: string;
  options: MutationCreateDish_createDish_dish_options[] | null;
}

export interface MutationCreateDish_createDish {
  __typename: "CreateDishOutput";
  ok: boolean;
  error: string | null;
  dish: MutationCreateDish_createDish_dish | null;
}

export interface MutationCreateDish {
  createDish: MutationCreateDish_createDish;
}

export interface MutationCreateDishVariables {
  input: CreateDishInput;
}
