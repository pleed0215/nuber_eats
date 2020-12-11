import React from "react";
import { Link } from "react-router-dom";
import { HelmetOnlyTitle } from "../components/helmet.onlytitle";

export const NotFound = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <HelmetOnlyTitle title="Page not found" />
      <h2 className="text-5xl mb-20">Page Not Found</h2>
      <h4 className="text-3xl mb-16">
        The page you're looking for does not exist or has moved.
      </h4>
      <Link
        className="hover:underline text-2xl text-lime-600 font-semibold"
        to="/"
      >
        Go back home &rarr;
      </Link>
    </div>
  );
};
