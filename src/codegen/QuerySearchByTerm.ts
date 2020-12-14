/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: QuerySearchByTerm
// ====================================================

export interface QuerySearchByTerm_searchRestaurantByName_restaurants_category {
  __typename: "Category";
  id: number;
  name: string;
}

export interface QuerySearchByTerm_searchRestaurantByName_restaurants {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImage: string;
  category: QuerySearchByTerm_searchRestaurantByName_restaurants_category | null;
  address: string;
  isPromoted: boolean;
}

export interface QuerySearchByTerm_searchRestaurantByName {
  __typename: "SearchRestaurantOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  countTotalItems: number | null;
  restaurants: QuerySearchByTerm_searchRestaurantByName_restaurants[] | null;
}

export interface QuerySearchByTerm {
  searchRestaurantByName: QuerySearchByTerm_searchRestaurantByName;
}

export interface QuerySearchByTermVariables {
  term: string;
  page: number;
}
