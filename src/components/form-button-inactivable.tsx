import React from "react";
import { Loader } from "./loader";

type FormButtonInactivableType = {
  isActivate?: boolean;
  loading: boolean;
};

export const FormButtonInactivable: React.FC<FormButtonInactivableType> = ({
  isActivate = false,
  loading,
  children,
}) => (
  <button
    className="auth__form_button flex justify-center"
    disabled={!isActivate}
  >
    {loading ? <Loader /> : children}
  </button>
);
