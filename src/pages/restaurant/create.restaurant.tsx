import { gql, useApolloClient, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  MutationCreateRestaurant,
  MutationCreateRestaurantVariables,
} from "../../codegen/MutationCreateRestaurant";
import { FormButtonInactivable } from "../../components/form-button-inactivable";
import { HelmetOnlyTitle } from "../../components/helmet.onlytitle";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { BASE_URL } from "../../gloabl.constant";
import { GQL_MYRESTAURANTS } from "./my.restaurants";

const GQL_CREATE_RESTAURANT = gql`
  mutation MutationCreateRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      error
      ok
      restaurant {
        ...RestaurantPart
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

interface IForm {
  name: string;
  address: string;
  category: string;
  file: FileList;
}

export const CreateRestaurant = () => {
  const history = useHistory();
  const client = useApolloClient();

  const [createRestaurant, { loading, data }] = useMutation<
    MutationCreateRestaurant,
    MutationCreateRestaurantVariables
  >(GQL_CREATE_RESTAURANT, {
    onCompleted: (data: MutationCreateRestaurant) => {
      const { ok, error, restaurant } = data.createRestaurant;

      if (ok) {
        // faking cache
        const currentQuery = client.readQuery({ query: GQL_MYRESTAURANTS });
        const fakeData = currentQuery
          ? {
              myRestaurants: {
                ...currentQuery?.myRestaurants,
                count: currentQuery?.myRestaurants.count + 1,
                restaurants: [
                  {
                    ...restaurant,
                    __typename: "Restaurant",
                  },
                  ...currentQuery?.myRestaurants.restaurants,
                ],
              },
            }
          : {
              myRestaurants: {
                __typename: "MyRestaurantOutput",
                ok: true,
                error: null,
                count: 1,
                restaurants: {
                  ...restaurant,
                  __typename: "Restaurant",
                },
              },
            };

        client.writeQuery({
          query: GQL_MYRESTAURANTS,
          data: fakeData,
        });

        toast.success("Your restaurant is successfully made.");
      } else {
        toast.error(
          `Something is wrong while creating restaurant(Error: ${error})`
        );
      }
      history.push("/");
    },
  });

  const { register, handleSubmit, getValues, formState } = useForm<IForm>({
    mode: "onChange",
  });
  const onSubmit = async () => {
    try {
      const { name, address, category: categoryName, file } = getValues();
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append("file", actualFile);
      const { url: coverImage } = await (
        await fetch(`https://${BASE_URL}/upload/`, {
          method: "POST",
          body: formBody,
        })
      ).json();
      createRestaurant({
        variables: {
          input: {
            name,
            address,
            categoryName,
            coverImage,
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
        <div className="auth__input_wrapper">
          <input
            className="auth__form_input"
            type="file"
            name="file"
            accept="image/*"
            ref={register({ required: true })}
          />
        </div>
        <FormButtonInactivable
          isActivate={formState.isValid && !formState.isSubmitting}
          loading={loading}
        >
          Create Restaurant
        </FormButtonInactivable>
      </form>
      {data?.createRestaurant.error && (
        <p className="auth__form_error">{data.createRestaurant.error}</p>
      )}
    </div>
  );
};
