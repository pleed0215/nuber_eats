/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: MutationVerifyCode
// ====================================================

export interface MutationVerifyCode_verifyCode {
  __typename: "VerificationOutput";
  ok: boolean;
  error: string | null;
}

export interface MutationVerifyCode {
  verifyCode: MutationVerifyCode_verifyCode;
}

export interface MutationVerifyCodeVariables {
  code: string;
}
