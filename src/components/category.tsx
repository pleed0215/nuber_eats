import React from "react";
import { Link } from "react-router-dom";

interface ICategoryItem {
  width: number;
  height: number;
  image: string;
  name: string;
  slug: string;
}

export const CategoryItem: React.FC<ICategoryItem> = ({
  width,
  height,
  image,
  name,
  slug,
}) => {
  return (
    <Link to={`/category/${slug}`}>
      <div className="flex flex-col items-center group text-center font-semibold text-sm cursor-pointer">
        <div
          className={`w-${width} h-${height} rounded-full  flex flex-col group-hover:bg-gray-100 transition duration-100 cursor-pointer`}
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
          }}
        ></div>
        <span className="mt-1">{name}</span>
      </div>
    </Link>
  );
};
