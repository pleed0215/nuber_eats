import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { DishChoiceType, DishOptionType } from "../../codegen/globalTypes";
import {
  MutationUpdateDish,
  MutationUpdateDishVariables,
} from "../../codegen/MutationUpdateDish";
import { QueryDish } from "../../codegen/QueryDish";

import { FormButtonInactivable } from "../../components/form-button-inactivable";
import { HelmetOnlyTitle } from "../../components/helmet.onlytitle";
import { DISH_FRAGMENT } from "../../fragments";

import { GQL_MYRESTAURANT } from "./my.restaurant";

const GQL_UPDATE_DISH = gql`
  mutation MutationUpdateDish(
    $name: String
    $price: Float
    $description: String
    $options: [DishOptionType!]
    $dishId: Int!
  ) {
    updateDish(
      name: $name
      price: $price
      description: $description
      options: $options
      dishId: $dishId
    ) {
      ok
      error
    }
  }
  ${DISH_FRAGMENT}
`;

const GQL_DISH = gql`
  query QueryDish($id: Int!) {
    getDish(dishId: $id) {
      ok
      error
      dish {
        ...DishPart
      }
    }
  }
  ${DISH_FRAGMENT}
`;

interface IChoice {
  name: string;
  extra: number;
}

interface IOptions {
  name: string;
  extra: number;
  choices?: IChoice[] | null;
}
interface IUpdateDishForm {
  name: string;
  price: number;
  description: string;
  options: IOptions[];
}

interface IParams {
  restaurantId: string;
  dishId: string;
}

export const UpdateDish: React.FC = () => {
  const history = useHistory();
  const { restaurantId, dishId } = useParams<IParams>();

  const { data: dishData } = useQuery<QueryDish>(GQL_DISH, {
    variables: {
      id: +dishId,
    },
  });

  const [updateDish, { loading, data }] = useMutation<
    MutationUpdateDish,
    MutationUpdateDishVariables
  >(GQL_UPDATE_DISH, {
    onCompleted: (data: MutationUpdateDish) => {
      if (data.updateDish.ok) {
        toast.success("Dish successfully made.");
        history.goBack();
      } else {
        toast.error(
          `While creating menu, an error occured. Message: ${data.updateDish.error}`
        );
      }
    },
  });
  const {
    register,
    formState,
    handleSubmit,
    getValues,
    setValue,
    control,
    errors,
  } = useForm<IUpdateDishForm>({
    mode: "onChange",
  });
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: "options",
  });

  if (dishData) {
    console.log(dishData);
    setValue("name", dishData?.getDish?.dish?.name);
    setValue("price", dishData?.getDish?.dish?.price);
    setValue("description", dishData?.getDish?.dish?.description);
  }

  const onSubmit = async () => {
    try {
      const { name, price, description, options } = getValues();
      const dishOptions: DishOptionType[] = [];

      options?.forEach((option) => {
        const dishChoices: DishChoiceType[] | null = option?.choices
          ? []
          : null;

        if (dishChoices) {
          option?.choices?.forEach((choice) => {
            dishChoices.push({
              name: choice.name,
              extra: +choice.extra,
            });
          });
        }

        dishOptions.push({
          name: option.name,
          extra: +option.extra,
        });
      });

      await updateDish({
        variables: {
          name,
          description,
          price: +price,
          dishId: +dishId,
          options: dishOptions,
        },
      });
      history.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  const onAddClicked = () => {
    appendOption({
      value: "",
    });
  };
  const onDeleteClicked = (index) => {
    // @ts-ignore
    removeOption(index);
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
            ref={register({
              required: "Price is required",
              min: { value: 0, message: "Price must be over 0" },
            })}
          />
        </div>
        <div className="auth__input_wrapper">
          <input
            className={`auth__form_input ${
              errors.description && "border-red-500"
            }`}
            type="text"
            placeholder="Description"
            name="description"
            ref={register({
              required: "Category is required",
              minLength: 5,
            })}
          />
          {errors.description && (
            <span className="auth__form_error">
              {errors.description.message}
            </span>
          )}
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
            {optionFields.length === 0 ? (
              <div>
                <p className="text-sm font-thin text-black">
                  No options now. Click above button if you need one.
                </p>
              </div>
            ) : (
              <div>
                {optionFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border border-gray-500 p-5 mb-2"
                  >
                    <span className="inline-block mb-2 mr-4">
                      {`#${index + 1} Option`}
                    </span>
                    <span
                      className="cursor-pointer text-xs py-1 px-2 bg-red-300 text-red-600 rounded-md hover:bg-red-600 hover:text-red-300 transition duration-200"
                      onClick={() => onDeleteClicked(index)}
                    >
                      Delete me
                    </span>
                    <div className="flex justify-around">
                      <div className="auth__input_wrapper w-full mr-3">
                        <input
                          className="auth__form_input"
                          type="text"
                          name={`options[${index}].name`}
                          placeholder="Name"
                          ref={register({ required: true })}
                        />
                      </div>
                      <div className="auth__input_wrapper w-full">
                        <input
                          className="auth__form_input"
                          type="number"
                          name={`options[${index}].extra`}
                          placeholder="Extra"
                          ref={register({ required: true, min: 0 })}
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
          Update Dish
        </FormButtonInactivable>
      </form>
    </div>
  );
};
