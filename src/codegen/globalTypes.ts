/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum OrderStatus {
  Cooked = "Cooked",
  Cooking = "Cooking",
  Delivered = "Delivered",
  Pending = "Pending",
  Pickedup = "Pickedup",
}

export enum UserRole {
  Client = "Client",
  Delivery = "Delivery",
  Owner = "Owner",
}

export interface CreateDishInput {
  name: string;
  price: number;
  photo?: string | null;
  description: string;
  options?: DishOptionType[] | null;
  restaurantId: number;
}

export interface CreateRestaurantInput {
  name: string;
  coverImage: string;
  address: string;
  categoryName?: string | null;
}

export interface CreateUserInput {
  email: string;
  password: string;
  role: UserRole;
}

export interface DishChoiceType {
  name: string;
  extra?: number | null;
}

export interface DishOptionType {
  name: string;
  choices?: DishChoiceType[] | null;
  extra?: number | null;
}

export interface UpdateProfileInput {
  email?: string | null;
  role?: UserRole | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
