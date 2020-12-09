import React from "react";
import uberLogo from "../images/eats-logo.svg";
import { NuberLogo } from "./uberlogo";

interface IHeader {
  email: string;
}

export const Header: React.FC<IHeader> = ({ email }) => {
  return (
    <header className="py-4 ">
      <div className="w-full  max-w-screen-xl mx-auto flex justify-between items-center">
        <NuberLogo className="w-40" />
        <span>{email}</span>
      </div>
    </header>
  );
};
