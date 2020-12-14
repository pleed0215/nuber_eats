import React from "react";
import { QueryRestaurants_allCategories_categories } from "../codegen/QueryRestaurants";
import { CategoryItem } from "./category";

interface ICategories {
  categories: QueryRestaurants_allCategories_categories[] | null | undefined;
}

export const Categories: React.FC<ICategories> = ({ categories }) => {
  return (
    <div className="w-full flex justify-around items-center">
      {categories?.map((category) => (
        <CategoryItem
          key={category.name}
          width={14}
          height={14}
          image={category.image}
          name={category.name}
        />
      ))}
    </div>
  );
};
