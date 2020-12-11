import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import { NuberLogo } from "./uberlogo";

export const Header: React.FC = () => {
  const { data } = useMe();
  return (
    <>
      {!data?.me?.verified && (
        <div className="shadow-lg text-center p-3">
          <span>Please verify your email.</span>
        </div>
      )}
      <header className="py-4 ">
        <div className="w-full px-5 max-w-screen-xl mx-auto flex justify-between items-center">
          <div>
            <NuberLogo className="w-40" />
          </div>
          <div>
            <Link to="/me">
              <span className="text-xl">
                <FontAwesomeIcon icon={faUserAlt} className="mr-2" />
                {data?.me?.email}
              </span>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};
