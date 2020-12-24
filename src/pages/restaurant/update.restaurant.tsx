import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { reset } from "cypress/types/sinon";
import React from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  MutationUpdateRestaurant,
  MutationUpdateRestaurantVariables,
} from "../../codegen/MutationUpdateRestaurant";
import {
  QueryMyRestaurant,
  QueryMyRestaurantVariables,
} from "../../codegen/QueryMyRestaurant";
import { QueryRestaurant } from "../../codegen/QueryRestaurant";
import { FormButtonInactivable } from "../../components/form-button-inactivable";
import { HelmetOnlyTitle } from "../../components/helmet.onlytitle";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { GQL_MYRESTAURANT } from "./my.restaurant";

const GQL_UPDATE_RESTAURANT = gql`
  mutation MutationUpdateRestaurant($input: UpdateRestaurantInput!) {
    updateRestaurant(input: $input) {
      error
      ok
    }
  }
`;

interface IForm {
  name: string;
  address: string;
  category: string;
}

interface IParams {
  id: string;
}

export const UpdateRestaurant = () => {
  const history = useHistory();
  const { id } = useParams<IParams>();
  const { data } = useQuery<QueryMyRestaurant, QueryMyRestaurantVariables>(
    GQL_MYRESTAURANT,
    {
      variables: {
        id: +id,
      },
    }
  );
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState,
    errors,
  } = useForm<IForm>({
    mode: "onChange",
    defaultValues: {
      name: data?.restaurant?.restaurant?.name,
      address: data?.restaurant?.restaurant?.address,
      category: data?.restaurant?.restaurant?.category?.name,
    },
  });

  console.log(formState);

  const [updateRestaurant, { loading }] = useMutation<
    MutationUpdateRestaurant,
    MutationUpdateRestaurantVariables
  >(GQL_UPDATE_RESTAURANT, {
    onCompleted: (data: MutationUpdateRestaurant) => {
      const { ok, error } = data.updateRestaurant;
      if (ok) {
        toast.success("Your restaurant is successfully made.");
      } else {
        toast.error(
          `Something is wrong while creating restaurant(Error: ${error})`
        );
      }
      history.push("/");
    },
    refetchQueries: [
      {
        query: GQL_MYRESTAURANT,
        variables: {
          id: +id,
        },
      },
    ],
  });

  const onSubmit = async () => {
    try {
      const { name, address, category: categoryName } = getValues();

      updateRestaurant({
        variables: {
          input: {
            id: +id,
            name,
            address,
            categoryName,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="layout__container">
      <HelmetOnlyTitle title="Creating restaurant" />
      <h1 className="text-2xl font-semibold my-8">CreateRestaurant</h1>
      <form
        className="auth__form"
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
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
          Update Restaurant
        </FormButtonInactivable>
      </form>
    </div>
  );
};
