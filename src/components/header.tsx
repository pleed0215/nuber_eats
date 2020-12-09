import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import uberLogo from "../images/eats-logo.svg";
import { NuberLogo } from "./uberlogo";

export const Header: React.FC = () => {
  const { data } = useMe();
  return (
    <header className="py-4 ">
      <div className="w-full px-5 md:px-0 lg:px-0 xl:px-0 max-w-screen-xl mx-auto flex justify-between items-center">
        <div>
          <NuberLogo className="w-40" />
        </div>
        <div>
          <Link to="/me">
            <span className="text-xl">
              <FontAwesomeIcon icon={faUser} />
              {data?.me.email}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};
