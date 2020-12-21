/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: DishPart
// ====================================================

export interface DishPart_options_choices {
  __typename: "DishChoiceOption";
  name: string;
  extra: number | null;
}

export interface DishPart_options {
  __typename: "DishOption";
  name: string;
  extra: number | null;
  choices: DishPart_options_choices[] | null;
}

export interface DishPart {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
  photo: string | null;
  description: string;
  options: DishPart_options[] | null;
}
