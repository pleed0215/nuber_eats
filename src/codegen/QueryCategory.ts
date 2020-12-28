/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: QueryCategory
// ====================================================

export interface QueryCategory_category_category_restaurantsOn {
  __typename: "CategoryDetailOutput";
  count: number | null;
}

export interface QueryCategory_category_category {
  __typename: "Category";
  id: number;
  slug: string;
  name: string;
  image: string;
  restaurantsOn: QueryCategory_category_category_restaurantsOn;
}

export interface QueryCategory_category_restaurants_category {
  __typename: "Category";
  id: number;
  name: string;
  slug: string;
}

export interface QueryCategory_category_restaurants {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImage: string;
  category: QueryCategory_category_restaurants_category | null;
  address: string;
  isPromoted: boolean;
}

export interface QueryCategory_category {
  __typename: "CategoryOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  currentPage: number | null;
  countTotalItems: number | null;
  category: QueryCategory_category_category | null;
  restaurants: QueryCategory_category_restaurants[] | null;
}

export interface QueryCategory {
  category: QueryCategory_category;
}

export interface QueryCategoryVariables {
  page?: number | null;
  slug: string;
}
