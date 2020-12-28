/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: QueryRestaurants
// ====================================================

export interface QueryRestaurants_allCategories_categories_restaurants {
  __typename: "Restaurant";
  name: string;
}

export interface QueryRestaurants_allCategories_categories {
  __typename: "Category";
  id: number;
  name: string;
  image: string;
  slug: string;
  restaurants: QueryRestaurants_allCategories_categories_restaurants[] | null;
}

export interface QueryRestaurants_allCategories {
  __typename: "AllCategoriesOutput";
  ok: boolean;
  error: string | null;
  count: number | null;
  categories: QueryRestaurants_allCategories_categories[] | null;
}

export interface QueryRestaurants_allRestaurants_restaurants_category {
  __typename: "Category";
  name: string;
  slug: string;
}

export interface QueryRestaurants_allRestaurants_restaurants {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImage: string;
  address: string;
  isPromoted: boolean;
  category: QueryRestaurants_allRestaurants_restaurants_category | null;
}

export interface QueryRestaurants_allRestaurants {
  __typename: "RestaurantsOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  currentPage: number | null;
  countTotalItems: number | null;
  restaurants: QueryRestaurants_allRestaurants_restaurants[] | null;
}

export interface QueryRestaurants {
  allCategories: QueryRestaurants_allCategories;
  allRestaurants: QueryRestaurants_allRestaurants;
}

export interface QueryRestaurantsVariables {
  page: number;
}
