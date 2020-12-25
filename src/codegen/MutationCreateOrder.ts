/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateOrderItemInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: MutationCreateOrder
// ====================================================

export interface MutationCreateOrder_createOrder {
  __typename: "CreateOrderOutput";
  ok: boolean;
  error: string | null;
}

export interface MutationCreateOrder {
  createOrder: MutationCreateOrder_createOrder;
}

export interface MutationCreateOrderVariables {
  input?: CreateOrderItemInput | null;
}
