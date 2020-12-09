import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  LoginMutation,
  LoginMutationVariables,
} from "../codegen/LoginMutation";
import { EMAIL_REGEX } from "../utils";

import nuberLogo from "../images/eats-logo.svg";
import { FormButtonInactivable } from "../components/form-button-inactivable";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { TOKEN_NAME } from "../gloabl.constant";

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
  const { register, handleSubmit, errors, formState } = useForm<LoginForm>({
    mode: "onChange",
  });
  const [login, { loading }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(GQL_LOGIN, {
    onCompleted: ({ login: { ok, error, token } }) => {
      if (ok && token) {
        toast.success("Welcome to nuber-eats");
        authTokenVar(token);
        localStorage.setItem(TOKEN_NAME, token);
        isLoggedInVar(true);
      } else {
        toast.error(error);
      }
    },
  });

  const onSubmit = async ({ email, password }) => {
    if (!loading) {
      login({
        variables: {
          email,
          password,
        },
      });
    }
  };

  return (
    <div className="h-screen w-full min-w-scree-sm flex justify-center ">
      <Helmet>
        <title>Welcome back to nuber-eats</title>
      </Helmet>
      <div className="h-auto w-full max-w-screen-sm flex flex-col items-center ">
        <img src={nuberLogo} alt="logo" className="w-60 mb-5 mt-10 lg:mt-32" />
        <div className="bg-white w-full max-h-half h-1/3 max-w-lg text-gray-800 px-10 py-10 rounded-lg text-center">
          <h3 className="text-3xl font-medium w-full text-left text-gray-800">
            Welcome back
          </h3>
          <form
            className="flex flex-col mt-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col">
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
            <div className="flex flex-col">
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
            <FormButtonInactivable
              loading={loading}
              isActivate={formState.isValid}
            >
              Log in
            </FormButtonInactivable>
          </form>
          <p className="mt-4">
            New to Nuber?{" "}
            <Link
              to="/create-account"
              className="text-lime-600 hover:underline font-semibold"
            >
              Create an account.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
