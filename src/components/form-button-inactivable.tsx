import React from "react";

type FormButtonInactivableType = {
  isActivate?: boolean;
  loading: boolean;
};

export const FormButtonInactivable: React.FC<FormButtonInactivableType> = ({
  isActivate = false,
  loading,
  children,
}) => (
  <button className="auth__form_button" disabled={!isActivate}>
    {loading ? "Processing..." : children}
  </button>
);
