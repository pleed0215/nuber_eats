import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import {
  MutationCreateRestaurant,
  MutationCreateRestaurantVariables,
} from "../../codegen/MutationCreateRestaurant";
import { FormButtonInactivable } from "../../components/form-button-inactivable";
import { HelmetOnlyTitle } from "../../components/helmet.onlytitle";

const GQL_CREATE_RESTAURANT = gql`
  mutation MutationCreateRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      error
      ok
    }
  }
`;

interface IForm {
  name: string;
  address: string;
  categoryName: string;
}

export const CreateRestaurant = () => {
  const [createRestaurant, { loading, data }] = useMutation<
    MutationCreateRestaurant,
    MutationCreateRestaurantVariables
  >(GQL_CREATE_RESTAURANT);

  const {
    register,
    handleSubmit,
    getValues,
    formState,
    errors,
  } = useForm<IForm>({
    mode: "onBlur",
  });
  const onSubmit = () => {
    console.log(getValues());
  };

  return (
    <div className="layout__container">
      <HelmetOnlyTitle title="Creating restaurant" />
      <h1 className="text-2xl font-semibold my-8">CreateRestaurant</h1>
      <form className="auth__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="auth__input_wrapper">
          <input
            className="auth__form_input"
            type="text"
            placeholder="Name"
            name="name"
            ref={register({ required: "Name is required" })}
          />
        </div>
        <div className="auth__input_wrapper">
          <input
            className="auth__form_input"
            type="text"
            placeholder="Address"
            name="address"
            ref={register({ required: "Address is required" })}
          />
        </div>
        <div className="auth__input_wrapper">
          <input
            className="auth__form_input"
            type="text"
            placeholder="Category"
            name="category"
            ref={register({ required: "Category is required" })}
          />
        </div>
        <FormButtonInactivable isActivate={formState.isValid} loading={loading}>
          Create Restaurant
        </FormButtonInactivable>
      </form>
    </div>
  );
};
