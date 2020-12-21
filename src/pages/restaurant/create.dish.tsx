import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  MutationCreateDish,
  MutationCreateDishVariables,
  MutationCreateDish_createDish_dish_options,
} from "../../codegen/MutationCreateDish";
import {
  QueryMyRestaurant,
  QueryMyRestaurant_restaurant_restaurant_dishes,
} from "../../codegen/QueryMyRestaurant";
import { FormButtonInactivable } from "../../components/form-button-inactivable";
import { HelmetOnlyTitle } from "../../components/helmet.onlytitle";
import { DISH_FRAGMENT } from "../../fragments";
import { useQueryParam } from "../../hooks/useQueryParam";
import { GQL_MYRESTAURANT } from "./my.restaurant";
import { GQL_MYRESTAURANTS } from "./my.restaurants";

const GQL_CREATE_DISH = gql`
  mutation MutationCreateDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
      dish {
        ...DishPart
      }
    }
  }
  ${DISH_FRAGMENT}
`;

interface ICreateDishForm {
  name: string;
  price: number;
  description: string;
  file: FileList;
}

interface IParams {
  id: string;
}

export const CreateDish: React.FC = () => {
  const client = useApolloClient();
  const history = useHistory();
  const [dishOptions, setDishOptions] = useState<
    MutationCreateDish_createDish_dish_options[]
  >([]);
  const [optionsCount, setOptionsCount] = useState<number>(0);
  const [createDish, { loading, data, error }] = useMutation<
    MutationCreateDish,
    MutationCreateDishVariables
  >(GQL_CREATE_DISH, {
    onCompleted: (data: MutationCreateDish) => {
      if (data.createDish.ok) {
        const currentRestaurant = client.readQuery<QueryMyRestaurant>({
          query: GQL_MYRESTAURANT,
          variables: {
            id: +restaurantId,
          },
        });
        let dishes: QueryMyRestaurant_restaurant_restaurant_dishes[] = [];
        if (currentRestaurant?.restaurant.restaurant?.dishes)
          dishes = currentRestaurant?.restaurant.restaurant?.dishes;
        client.writeQuery({
          query: GQL_MYRESTAURANT,
          data: {
            restaurant: {
              ...currentRestaurant?.restaurant,
              restaurant: {
                ...currentRestaurant?.restaurant.restaurant,
                dishes: [data.createDish.dish, ...dishes],
              },
            },
          },
          variables: {
            id: +restaurantId,
          },
        });
        toast.success("Dish successfully made.");
        history.goBack();
      } else {
        toast.error(
          `While creating menu, an error occured. Message: ${data.createDish.error}`
        );
      }
    },
  });
  const {
    register,
    formState,
    unregister,
    handleSubmit,
    getValues,
    errors,
  } = useForm<ICreateDishForm>({
    mode: "onChange",
  });

  const { id: restaurantId } = useParams<IParams>();
  const onSubmit = async () => {
    try {
      const { name, price, description, file } = getValues();
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append("file", actualFile);
      const { url: photo } = await (
        await fetch(`http://lednas.synology.me:32789/upload/`, {
          method: "POST",
          body: formBody,
        })
      ).json();

      /*await createDish({
        variables: {
          input: {
            name,
            description,
            price: +price,
            photo,
            restaurantId: +restaurantId,
          },
        },
      });*/
    } catch (error) {
      console.log(error);
    }
  };

  const onAddClicked = () => {
    setOptionsCount(optionsCount + 1);
  };
  const onDeleteClicked = (index) => {
    // @ts-ignore
    unregister(`${index}-OptionName`);
    // @ts-ignore
    unregister(`${index}-OptionExtra`);
  };

  return (
    <div className="layout__container">
      <HelmetOnlyTitle title="Creating dish" />
      <h1 className="text-2xl font-semibold my-8">Create Dish</h1>
      <form
        className="auth__form"
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
        <p className="text-xl italic text-black mb-2">
          Write dish information here.
        </p>
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
            type="number"
            placeholder="Price"
            name="price"
            ref={register({ required: "Price is required" })}
          />
        </div>
        <div className="auth__input_wrapper">
          <input
            className="auth__form_input"
            type="text"
            placeholder="Description"
            name="description"
            ref={register({
              required: "Category is required",
              min: { value: 0, message: "Price must be over 0" },
            })}
          />
        </div>
        <div className="auth__input_wrapper">
          <label htmlFor="file" className="text-md italic self-start mb-1">
            Dish image
          </label>
          <input
            className="auth__form_input"
            id="file"
            type="file"
            name="file"
            accept="image/*"
            ref={register({ required: true })}
          />
        </div>
        <div className="border-t border-gray-600 mt-2 pt-2">
          <p className="text-xl italic">Dish options</p>
          <span
            onClick={() => onAddClicked()}
            className="auth__form_button inline-block mb-2 cursor-pointer"
          >
            Add Option
          </span>
          <div className="mb-2">
            {optionsCount === 0 ? (
              <div>
                <p className="text-sm font-thin text-black">
                  No options now. Click above button if you need one.
                </p>
              </div>
            ) : (
              <div>
                {Array.from(new Array(optionsCount)).map((_, index) => (
                  <div className="border border-gray-500 p-5 mb-2">
                    <span className="inline-block mb-2 mr-4">
                      {`#${index + 1} Option`}
                    </span>
                    <span className="cursor-pointer text-xs py-1 px-2 bg-red-300 text-red-600 rounded-md hover:bg-red-600 hover:text-red-300 transition duration-200">
                      Delete me
                    </span>
                    <div className="flex justify-around">
                      <div className="auth__input_wrapper w-full mr-3">
                        <input
                          className="auth__form_input"
                          type="text"
                          name={`${index}-OptionName`}
                          placeholder="Name"
                          ref={register({ required: true })}
                        />
                      </div>
                      <div className="auth__input_wrapper w-full">
                        <input
                          className="auth__form_input"
                          type="number"
                          name={`${index}-OptionExtra`}
                          placeholder="Extra"
                          ref={register({ required: true })}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <FormButtonInactivable
          isActivate={formState.isValid && !formState.isSubmitting}
          loading={loading}
        >
          Create Dish
        </FormButtonInactivable>
      </form>
      {data?.createDish.error && (
        <p className="auth__form_error">{data.createDish.error}</p>
      )}
    </div>
  );
};
