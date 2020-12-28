/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: MutationUpdatePassword
// ====================================================

export interface MutationUpdatePassword_updatePassword {
  __typename: "LoginOutput";
  ok: boolean;
  error: string | null;
}

export interface MutationUpdatePassword {
  updatePassword: MutationUpdatePassword_updatePassword;
}

export interface MutationUpdatePasswordVariables {
  password: string;
}
