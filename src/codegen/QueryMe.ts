/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserRole } from "./globalTypes";

// ====================================================
// GraphQL query operation: QueryMe
// ====================================================

export interface QueryMe_me {
  __typename: "User";
  id: number;
  email: string;
  role: UserRole;
  address: string | null;
  verified: boolean | null;
}

export interface QueryMe {
  me: QueryMe_me | null;
}
