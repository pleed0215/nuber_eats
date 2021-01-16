import React from "react";

enum SpinType {
  default = "default",
  tailSpin = "tail-spin",
}

export type Spin = keyof typeof SpinType;

// color tailwindcss color
interface ILoader {
  size?: number; // size using tailwindcss unit.
  color?: string; // web color not tailwind color
  type?: Spin;
}

export const Loader: React.FC<ILoader> = ({
  size = 5,
  color = "#44a8db",
  type = "default",
}) => {
  return (
    <>
      {type === "default" && (
        <div
          className={`animate-spin w-${size} h-${size} rounded-full border-2 border-gray-200`}
          style={{ borderTopColor: color }}
        />
      )}
      {type === "tailSpin" && (
        <img src={process.env.PUBLIC_URL + "tail-spin.svg"} />
      )}
    </>
  );
};
