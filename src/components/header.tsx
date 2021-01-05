import { faDoorOpen, faUserAlt } from "@fortawesome/free-solid-svg-icons";
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
        <div className="layout__container flex justify-between items-center">
          <div>
            <Link to="/">
              <NuberLogo className="w-40" />
            </Link>
          </div>
          <div>
            <Link to="/my-page">
              <span className="text-lg mr-6 hover:underline">
                <FontAwesomeIcon icon={faUserAlt} className="mr-2" />
                {data?.me?.email}
              </span>
            </Link>
            <Link to="/logout">
              <span className="text-lg hover:underline">
                <FontAwesomeIcon icon={faDoorOpen} className="mr-2" />
                Log out
              </span>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};
