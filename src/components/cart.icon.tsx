import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface ICartIcon {
  n?: number;
}

export const CartIcon: React.FC<ICartIcon> = ({ n = 0 }) => {
  return (
    <div
      className={`w-10 h-10 shadow-lg relative flex border rounded-full p-2 bg-gray-200 hover:bg-gray-300 transition duration-200 items-center justify-center`}
    >
      <div>
        <FontAwesomeIcon icon={faCartPlus} />
      </div>
      <div className="w-4 h-4 absolute -top-1 rounded-full -right-1 text-xs bg-red-600 text-white flex justify-center p-1 items-center">
        {n}
      </div>
    </div>
  );
};
