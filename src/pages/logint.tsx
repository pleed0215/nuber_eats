import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  LoginMutation,
  LoginMutationVariables,
} from "../codegen/LoginMutation";
import { EMAIL_REGEX } from "../utils";

const GQL_LOGIN = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      error
      token
    }
  }
`;

type LoginForm = {
  email?: string;
  password?: string;
};

export const LoginPage = () => {
  const { register, handleSubmit, getValues, errors } = useForm<LoginForm>();
  const [login, { loading }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(GQL_LOGIN, {
    onCompleted: ({ login: { ok, error, token } }) => {
      if (ok) {
        console.log(token);
      } else {
        toast.error(error);
      }
    },
  });

  const onSubmit = async ({ email, password }) => {
    login({
      variables: {
        email,
        password,
      },
    });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg text-gray-800 px-10 py-10 rounded-lg text-center">
        <h3 className="text-2xl text-gray-800">Log in</h3>
        <form
          className="flex flex-col mt-5 px-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col mb-4">
            <input
              placeholder="Email"
              name="email"
              type="email"
              className="auth__form_input"
              ref={register({
                required: {
                  value: true,
                  message: "Email address required.",
                },
                pattern: {
                  value: EMAIL_REGEX,
                  message: "Please input email address.",
                },
              })}
            />
            {errors.email?.message ? (
              <span className="auth__form_error">{errors.email.message}</span>
            ) : (
              <span></span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <input
              placeholder="Password"
              name="password"
              type="password"
              className="auth__form_input"
              ref={register({
                required: {
                  value: true,
                  message: "Password required",
                },
              })}
            />
            {errors.password?.message && (
              <span className="auth__form_error">
                {errors.password.message}
              </span>
            )}
          </div>
          <button className="auth__form_button">
            {loading ? "Processing..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
};
