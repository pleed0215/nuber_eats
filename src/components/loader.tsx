import React from "react";

// color tailwindcss color
interface ILoader {
  size?: number; // size using tailwindcss unit.
  color?: string; // web color not tailwind color
}

export const Loader: React.FC<ILoader> = ({ size = 5, color = "#44a8db" }) => {
  return (
    <div
      className={`animate-spin w-${size} h-${size} rounded-full border-2 border-gray-200`}
      style={{ borderTopColor: color }}
    ></div>
  );
};
