import { gql, useApolloClient, useMutation } from "@apollo/client";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { UpdateProfileInput, UserRole } from "../../codegen/globalTypes";
import {
  MutationUpdateProfile,
  MutationUpdateProfileVariables,
} from "../../codegen/MutationUpdateProfile";
import { FormButtonInactivable } from "../../components/form-button-inactivable";
import { useMe } from "../../hooks/useMe";
import { EMAIL_REGEX } from "../../utils";

const GQL_UPDATE_PROFILE = gql`
  mutation MutationUpdateProfile($update: UpdateProfileInput!) {
    updateProfile(update: $update) {
      ok
      error
    }
  }
`;

export const EditProfile = () => {
  const { data: userData } = useMe();
  const history = useHistory();
  const client = useApolloClient();
  const [updateProfile, { loading }] = useMutation<
    MutationUpdateProfile,
    MutationUpdateProfileVariables
  >(GQL_UPDATE_PROFILE, {
    onCompleted: async ({ updateProfile: { ok, error } }) => {
      if (ok) {
        if (userData?.me?.email !== getValues("email")) {
          client.writeFragment({
            id: `User:${userData?.me?.id}`,
            fragment: gql`
              fragment VerifiedUser on User {
                verified
                email
              }
            `,
            data: {
              email: getValues("email"),
              verified: false,
            },
          });
        }
        toast.success("Updated your profile successfully.");
        history.push("/");
      } else {
        toast.error(error);
      }
    },
  });
  const {
    register,
    handleSubmit,
    getValues,
    errors,
    formState,
  } = useForm<UpdateProfileInput>({
    defaultValues: {
      email: userData?.me?.email,
      role: userData?.me?.role,
    },
    mode: "onBlur",
  });
  const onSubmit = (data: UpdateProfileInput) => {
    if (data) {
      updateProfile({
        variables: {
          update: data,
        },
      });
    }
  };

  return (
    <div className="px-5 items-center flex flex-col w-screen mt-32">
      <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
      <form
        className="auth__form max-w-screen-sm w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="auth__input_wrapper">
          <input
            className="auth__form_input"
            type="email"
            name="email"
            placeholder="Email"
            ref={register({
              pattern: {
                value: EMAIL_REGEX,
                message: "Not valid email address.",
              },
            })}
            required
          />
          {errors.email && (
            <span className="auth__form_error">{errors.email.message}</span>
          )}
        </div>
        <select className="auth__form_input" name="role" ref={register()}>
          {Object.keys(UserRole).map((role) => (
            <option key={role}>{role}</option>
          ))}
        </select>
        <FormButtonInactivable loading={loading} isActivate={formState.isValid}>
          Update Profile
        </FormButtonInactivable>
      </form>
      <div>
        <Link to="/password">
          <p className="text-italic hover:underline text-black font-semibold mt-2">
            Change password
            <FontAwesomeIcon icon={faKey} className="ml-3" />
          </p>
        </Link>
      </div>
    </div>
  );
};
