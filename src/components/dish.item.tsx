import React from "react";

interface IDish {
  name: string;
  description?: string;
  price: number;
  photo?: string | null;
}

export const DishItem: React.FC<IDish> = ({
  name,
  description,
  price,
  photo,
}) => {
  return (
    <div className="flex h-40 border border-gray-300 hover:border-gray-600 transition duration-200">
      <div className="w-3/5 flex flex-col items-start justify-between p-4">
        <div className="w-full h-4/5">
          <p className="text-black font-normal text-md">{name}</p>
          <p className="h-20 text-gray-500 font-thin text-md overflow-ellipsis overflow-hidden">
            {description}
          </p>
        </div>
        <div className="w-full h-1/5">
          <p className="text-black">{`$${price}`}</p>
        </div>
      </div>
      <div
        className="w-2/5 bg-center bg-cover"
        style={{ backgroundImage: `url(${photo})` }}
      ></div>
    </div>
  );
};
