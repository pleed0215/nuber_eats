import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import {
  MutationUpdatePassword,
  MutationUpdatePasswordVariables,
} from "../../codegen/MutationUpdatePassword";
import { FormButtonInactivable } from "../../components/form-button-inactivable";
import { useMe } from "../../hooks/useMe";

const GQL_UPDATE_PASSWORD = gql`
  mutation MutationUpdatePassword($password: String!) {
    updatePassword(password: $password) {
      ok
      error
    }
  }
`;

interface UpdatePasswordForm {
  password: string;
  password2: string;
}

export const UpdatePassword = () => {
  const { data: userData } = useMe();
  const [updatePassword, { loading, data, error }] = useMutation<
    MutationUpdatePassword,
    MutationUpdatePasswordVariables
  >(GQL_UPDATE_PASSWORD);
  const {
    register,
    handleSubmit,
    getValues,
    errors,
    formState,
  } = useForm<UpdatePasswordForm>({
    mode: "onChange",
  });

  const onSubmit = (data: UpdatePasswordForm) => {
    if (data) {
      updatePassword({
        variables: {
          password: data.password,
        },
      });
    }
  };
  return (
    <div className="px-5 items-center flex flex-col w-screen">
      <h4 className="font-semibold text-2xl mb-3">Change Password</h4>
      <form
        className="auth__form max-w-screen-sm w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="auth__input_wrapper">
          <input
            className="auth__form_input"
            type="password"
            name="password"
            placeholder="Password"
            ref={register({
              minLength: {
                value: 8,
                message: "Password length must be over 8.",
              },
              maxLength: {
                value: 16,
                message: "Password length must be under 16.",
              },
            })}
            required
          />
          {errors.password && (
            <span className="auth__form_error">{errors.password.message}</span>
          )}
        </div>
        <div className="auth__input_wrapper">
          <input
            className="auth__form_input"
            type="password"
            name="password2"
            placeholder="Verify your input."
            ref={register({
              validate: (value) =>
                value === getValues("password") ||
                "Password is not equal above.",
            })}
            required
          />
          {errors.password2 && (
            <span className="auth__form_error">{errors.password2.message}</span>
          )}
        </div>

        <FormButtonInactivable
          isActivate={formState.dirtyFields.password && formState.isValid}
          loading={loading}
        >
          Change Password
        </FormButtonInactivable>
      </form>
    </div>
  );
};
