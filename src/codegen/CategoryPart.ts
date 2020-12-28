/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CategoryPart
// ====================================================

export interface CategoryPart_restaurantsOn {
  __typename: "CategoryDetailOutput";
  count: number | null;
}

export interface CategoryPart {
  __typename: "Category";
  id: number;
  slug: string;
  name: string;
  image: string;
  restaurantsOn: CategoryPart_restaurantsOn;
}
