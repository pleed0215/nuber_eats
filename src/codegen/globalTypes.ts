/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum UserRole {
  Client = "Client",
  Delivery = "Delivery",
  Owner = "Owner",
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

export interface UpdateProfileInput {
  email?: string | null;
  role?: UserRole | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
