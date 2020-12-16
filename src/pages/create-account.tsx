import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { CreateUserVariables, CreateUser } from "../codegen/CreateUser";
import { CreateUserInput, UserRole } from "../codegen/globalTypes";
import { FormButtonInactivable } from "../components/form-button-inactivable";
import { HelmetOnlyTitle } from "../components/helmet.onlytitle";
import nuberLogo from "../images/eats-logo.svg";
import { EMAIL_REGEX } from "../utils";

const GQL_CREATE_ACCOUNT = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ok
      error
    }
  }
`;

export const CreateAccountPage = () => {
  const {
    register,
    handleSubmit,
    errors,
    formState,
  } = useForm<CreateUserInput>({
    mode: "onBlur",
    defaultValues: {
      role: UserRole.Client,
    },
  });
  const history = useHistory();
  const [createUser, { loading }] = useMutation<
    CreateUser,
    CreateUserVariables
  >(GQL_CREATE_ACCOUNT, {
    onCompleted: ({ createUser: { ok, error } }) => {
      if (ok) {
        toast.success("Your account is successfully made. Please login now.");
        history.push("/");
      } else {
        toast.error(error);
      }
    },
  });

  const onSubmit = async (input: CreateUserInput) => {
    if (!loading) {
      createUser({
        variables: {
          input,
        },
      });
    }
  };

  return (
    <div className="h-screen w-full flex justify-center ">
      <HelmetOnlyTitle title="Creating your account" />
      <div className="h-auto w-full max-w-screen-sm flex flex-col items-center ">
        <img src={nuberLogo} alt="logo" className="w-60 mb-5 mt-10 lg:mt-32" />
        <div className="bg-white w-full max-h-half h-1/3 max-w-lg text-gray-800 px-10 py-10 rounded-lg text-center">
          <h3 className="text-3xl font-medium w-full text-left text-gray-800">
            Let's get started
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
              {errors.email?.message && (
                <span className="auth__form_error">{errors.email.message}</span>
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
                  minLength: {
                    value: 8,
                    message: "Password too short, must be over 8",
                  },
                  maxLength: {
                    value: 16,
                    message: "Too long password, must be under 16",
                  },
                })}
              />
              {errors.password?.message && (
                <span className="auth__form_error">
                  {errors.password.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <select
                name="role"
                ref={register({ required: true })}
                className="auth__form_input"
              >
                {Object.keys(UserRole).map((role) => (
                  <option>{role}</option>
                ))}
              </select>
            </div>
            <FormButtonInactivable
              loading={loading}
              isActivate={formState.isValid}
            >
              Create Account
            </FormButtonInactivable>
          </form>
          <p className="mt-4">
            You already have your account?
            <Link
              to="/"
              className="text-lime-600 hover:underline font-semibold"
            >
              Sign in now.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
