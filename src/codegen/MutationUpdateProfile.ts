/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateProfileInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: MutationUpdateProfile
// ====================================================

export interface MutationUpdateProfile_updateProfile {
  __typename: "UpdateProfileOutput";
  ok: boolean;
  error: string | null;
}

export interface MutationUpdateProfile {
  updateProfile: MutationUpdateProfile_updateProfile;
}

export interface MutationUpdateProfileVariables {
  update: UpdateProfileInput;
}
