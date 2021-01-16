import {
  gql,
  useApolloClient,
  useLazyQuery,
  useMutation,
  useQuery,
} from "@apollo/client";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { DishChoiceType, DishOptionType } from "../../codegen/globalTypes";
import {
  MutationCreateDish,
  MutationCreateDishVariables,
} from "../../codegen/MutationCreateDish";
import { QueryDish } from "../../codegen/QueryDish";
import {
  QueryMyRestaurant,
  QueryMyRestaurant_restaurant_restaurant_dishes,
  QueryMyRestaurant_restaurant_restaurant_dishes_options_choices,
} from "../../codegen/QueryMyRestaurant";
import { FormButtonInactivable } from "../../components/form-button-inactivable";
import { HelmetOnlyTitle } from "../../components/helmet.onlytitle";
import { DISH_FRAGMENT } from "../../fragments";
import { BASE_URL } from "../../gloabl.constant";
import { GQL_MYRESTAURANT } from "./my.restaurant";

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
  isRemoved: boolean;
}

interface IOptions {
  name: string;
  extra: number;
  choice?: IChoice[] | null;
}
interface ICreateDishForm {
  name: string;
  price: number;
  description: string;
  file: FileList;
  options: IOptions[];
}

interface IParams {
  restaurantId: string;
  dishId: string;
}

interface IChoiceInfo {
  index: string;
  isExist: boolean;
  choice: IChoice;
}

interface IChoiceInput {
  optionIndex: number;
  choicesInfo: IChoiceInfo[] | null;
}

interface INestedChoice {
  register: any;
  control: any;
  field: any;
  namePrefix: any;
  choices?:
    | QueryMyRestaurant_restaurant_restaurant_dishes_options_choices[]
    | null;
}

const NestedChoice: React.FC<INestedChoice> = ({
  register,
  control,
  field,
  choices,
  namePrefix,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: namePrefix,
  });

  useMemo(
    () =>
      choices?.forEach((choice) =>
        append({ name: choice.name, extra: choice.extra })
      ),
    [choices]
  );

  return (
    <div className="w-full">
      <span
        className="cursor-pointer text-xs py-1 px-2 bg-lime-300 text-lime-600 rounded-md hover:bg-lime-600 hover:text-lime-300 transition duration-200 mr-4"
        onClick={() => append({ name: "", extra: 0 })}
      >
        Add choice
      </span>
      {fields.map((choice, choiceIndex) => (
        <div key={choice.id} className="flex justify-around items-center mt-2">
          <div className="w-1/6">
            <span>Choice #{choiceIndex + 1}</span>
          </div>
          <div className="w-2/6 mr-3">
            <input
              className="auth__form_input"
              type="text"
              name={`${namePrefix}[${choiceIndex}].name`}
              placeholder="Name"
              defaultValue={`${choice.name}`}
              ref={register({ required: true })}
            />
          </div>
          <div className=" w-2/6">
            <input
              className="auth__form_input"
              type="number"
              name={`${namePrefix}[${choiceIndex}].extra`}
              placeholder="Extra"
              defaultValue={`${choice.extra}`}
              ref={register({ required: true, min: 0 })}
            />
          </div>
          <div
            onClick={() => remove(choiceIndex)}
            className="cursor-pointer text-xs px-2 py-1 text-center bg-red-300 text-red-600 rounded-md hover:bg-red-600 hover:text-red-300 transition duration-200 ml-3"
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </div>
        </div>
      ))}
    </div>
  );
};

export const CreateDish: React.FC = () => {
  const client = useApolloClient();
  const history = useHistory();

  const { restaurantId, dishId } = useParams<IParams>();

  const [
    updateDish,
    { data: dishData, loading: dishLoading },
  ] = useLazyQuery<QueryDish>(GQL_DISH, {
    onCompleted: (data: QueryDish) => {
      setValue("name", dishData.getDish.dish.name);
      setValue("description", dishData.getDish.dish.description);
      setValue("price", dishData.getDish.dish.price);
      dishData.getDish.dish.options.forEach((option) => {
        appendOption({ name: option.name, extra: option.extra });
      });

      console.log(dishData.getDish.dish);
    },
  });

  useEffect(() => {
    if (dishId) {
      updateDish({
        variables: {
          id: +dishId,
        },
      });
    }
  }, []);

  const [createDish, { loading, data }] = useMutation<
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
    handleSubmit,
    getValues,
    setValue,
    control,
    errors,
  } = useForm<ICreateDishForm>({
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

  const onSubmit = async () => {
    try {
      const { name, price, description, file, options } = getValues();
      const dishOptions: DishOptionType[] = [];
      const actualFile = file[0];
      const formBody = new FormData();

      formBody.append("file", actualFile);

      options?.forEach((option) => {
        const dishChoices: DishChoiceType[] | null = option?.choice ? [] : null;

        option?.choice?.forEach((choice) => {
          dishChoices?.push({
            name: choice.name,
            extra: +choice.extra,
          });
        });

        dishOptions.push({
          name: option.name,
          extra: +option.extra,
          choices: dishChoices,
        });
      });

      const { url: photo } = await (
        await fetch(`https://${BASE_URL}/upload/`, {
          method: "POST",
          body: formBody,
        })
      ).json();
      await createDish({
        variables: {
          input: {
            name,
            description,
            price: +price,
            photo,
            restaurantId: +restaurantId,
            options: dishOptions,
          },
        },
      });

      history.goBack();
    } catch (error) {
      toast.error(
        `Some error while creating dish with error: ${error.message}`
      );
      history.push("/");
    }
  };

  const onAddClicked = () => {
    appendOption({ value: "afaf" });
  };
  const onDeleteClicked = (index) => {
    // @ts-ignore
    removeOption(index);
  };

  if (dishId && dishLoading) {
    return (
      <div className="layout__container flex justify-center items-center text-2xl">
        <HelmetOnlyTitle title="Creating dish" />
        Loading...
      </div>
    );
  }

  return (
    <div className="layout__container">
      <HelmetOnlyTitle title="Creating dish" />
      <h1 className="text-2xl font-semibold my-8">
        {dishData ? "Update Dish" : "Create Dish"}
      </h1>
      {/* Main form start. 
          Must implment double nested input.
          Ex) Dish > Choices 
      */}
      <form
        className="auth__form"
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
        <p className="text-xl italic text-black mb-2">
          Write dish information here.(Many bugs are here. To be fixed.)
        </p>
        {/* Dish information. Name, Price, Description */}
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
        {/* Starting Option part. Must be dynamic field. It is implemented by React Form Hook useFieldArray and it is easy to use. */}
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
                {/* useFieldArray() returns fields, append, remove, so on. */}
                {optionFields.map((field, optionIndex) => (
                  <div
                    key={field.id}
                    className="border border-gray-500 p-5 mb-2"
                  >
                    <span className="inline-block mb-2 mr-4">
                      {`#${optionIndex + 1} Option`}
                    </span>
                    <span
                      className="cursor-pointer text-xs py-1 px-2 bg-red-300 text-red-600 rounded-md hover:bg-red-600 hover:text-red-300 transition duration-200"
                      onClick={() => onDeleteClicked(optionIndex)}
                    >
                      Delete me
                    </span>
                    <div className="flex justify-around">
                      <div className="auth__input_wrapper w-full mr-3">
                        <input
                          className="auth__form_input"
                          type="text"
                          name={`options[${optionIndex}].name`}
                          defaultValue={`${field.name}`}
                          placeholder="Name"
                          ref={register({ required: true })}
                        />
                      </div>
                      <div className="auth__input_wrapper w-full">
                        <input
                          className="auth__form_input"
                          type="number"
                          name={`options[${optionIndex}].extra`}
                          defaultValue={`${field.extra}`}
                          placeholder="Extra"
                          ref={register({ required: true, min: 0 })}
                        />
                      </div>
                    </div>
                    {/* Double nested dynamic field for options->choice. Not using useArrayField.. 
                    in fact cannot use for double nested dynamic field.. */}
                    <div className="flex flex-col justify-center items-start w-2/3">
                      <NestedChoice
                        key={`options[${optionIndex}]`}
                        register={register}
                        control={control}
                        field={field}
                        choices={
                          dishData.getDish.dish.options[optionIndex].choices
                        }
                        namePrefix={`options[${optionIndex}].choices`}
                      />

                      {/*{optionChoices.map((o) => {
                        if (o.optionIndex !== optionIndex) {
                          return <></>;
                        } else {
                          return o.choicesInfo?.map(
                            (choice, choiceIndex) =>
                              choice.isExist && (
                                <div
                                  key={`${makeChoiceString(
                                    o.optionIndex,
                                    choiceIndex
                                  )}`}
                                  className="flex justify-around items-center mt-2"
                                >
                                  <div className="w-1/6">
                                    <span>Choice #{choiceIndex + 1}</span>
                                  </div>
                                  <div className="w-2/6 mr-3">
                                    <input
                                      className="auth__form_input"
                                      type="text"
                                      name={`options[${optionIndex}].choice[${choiceIndex}].name`}
                                      placeholder="Name"
                                      defaultValue=""
                                      ref={register({ required: true })}
                                    />
                                  </div>
                                  <div className=" w-2/6">
                                    <input
                                      className="auth__form_input"
                                      type="number"
                                      name={`options[${optionIndex}].choice[${choiceIndex}].extra`}
                                      placeholder="Extra"
                                      defaultValue="0"
                                      ref={register({ required: true, min: 0 })}
                                    />
                                    <input
                                      type="checkbox"
                                      name={`options[${optionIndex}].choice[${choiceIndex}].isRemoved`}
                                      defaultValue={0}
                                      ref={register()}
                                      hidden
                                    />
                                  </div>
                                  <div
                                    onClick={() =>
                                      onRemoveChoiceClicked(
                                        optionIndex,
                                        choiceIndex
                                      )
                                    }
                                    className="cursor-pointer text-xs px-2 py-1 text-center bg-red-300 text-red-600 rounded-md hover:bg-red-600 hover:text-red-300 transition duration-200 ml-3"
                                  >
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                  </div>
                                </div>
                              )
                          );
                        }
                      })}*/}
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
          {dishData ? "Update Dish" : "Create Dish"}
        </FormButtonInactivable>
      </form>
      {data?.createDish.error && (
        <p className="auth__form_error">{data.createDish.error}</p>
      )}
    </div>
  );
};
