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

export interface CreateUserInput {
  email: string;
  password: string;
  role: UserRole;
}

//==============================================================
// END Enums and Input Objects
//==============================================================