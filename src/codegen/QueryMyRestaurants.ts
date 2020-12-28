/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: QueryMyRestaurants
// ====================================================

export interface QueryMyRestaurants_myRestaurants_restaurants_category {
  __typename: "Category";
  id: number;
  name: string;
  slug: string;
}

export interface QueryMyRestaurants_myRestaurants_restaurants {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImage: string;
  category: QueryMyRestaurants_myRestaurants_restaurants_category | null;
  address: string;
  isPromoted: boolean;
}

export interface QueryMyRestaurants_myRestaurants {
  __typename: "MyRestaurantsOutput";
  ok: boolean;
  error: string | null;
  count: number | null;
  restaurants: QueryMyRestaurants_myRestaurants_restaurants[] | null;
}

export interface QueryMyRestaurants {
  myRestaurants: QueryMyRestaurants_myRestaurants;
}
