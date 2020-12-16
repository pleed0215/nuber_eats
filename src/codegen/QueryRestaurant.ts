/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: QueryRestaurant
// ====================================================

export interface QueryRestaurant_restaurant_restaurant_category {
  __typename: "Category";
  id: number;
  name: string;
  slug: string;
}

export interface QueryRestaurant_restaurant_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImage: string;
  category: QueryRestaurant_restaurant_restaurant_category | null;
  address: string;
  isPromoted: boolean;
}

export interface QueryRestaurant_restaurant {
  __typename: "RestaurantDetailOutput";
  ok: boolean;
  error: string | null;
  restaurant: QueryRestaurant_restaurant_restaurant | null;
}

export interface QueryRestaurant {
  restaurant: QueryRestaurant_restaurant;
}

export interface QueryRestaurantVariables {
  id: number;
}
