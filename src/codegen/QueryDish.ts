/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: QueryDish
// ====================================================

export interface QueryDish_getDish_dish_options_choices {
  __typename: "DishChoiceOption";
  name: string;
  extra: number | null;
}

export interface QueryDish_getDish_dish_options {
  __typename: "DishOption";
  name: string;
  extra: number | null;
  choices: QueryDish_getDish_dish_options_choices[] | null;
}

export interface QueryDish_getDish_dish {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
  photo: string | null;
  description: string;
  options: QueryDish_getDish_dish_options[] | null;
}

export interface QueryDish_getDish {
  __typename: "DishDetailOutput";
  ok: boolean;
  error: string | null;
  dish: QueryDish_getDish_dish | null;
}

export interface QueryDish {
  getDish: QueryDish_getDish;
}

export interface QueryDishVariables {
  id: number;
}
