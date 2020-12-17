import { render } from "@testing-library/react";
import React from "react";
import { FormButtonInactivable } from "../form-button-inactivable";

describe("<FormButtonInactivable />", () => {
  it("Should render OK with props", () => {
    const { getByText } = render(
      <FormButtonInactivable loading={false} isActivate={true}>
        test
      </FormButtonInactivable>
    );
    getByText("test");
  });

  it("Should text Processing... if loading prop is true", () => {
    const { getByText } = render(
      <FormButtonInactivable loading={true} isActivate={true}>
        test
      </FormButtonInactivable>
    );
    getByText("Processing...");
  });

  it("Should disabled if isActive prop is false", () => {
    const text = "test";
    const { container } = render(
      <FormButtonInactivable loading={false} isActivate={false}>
        {text}
      </FormButtonInactivable>
    );

    expect(container.firstChild).toHaveProperty("disabled", true);
    //expect(container.firstChild).toHaveAttribute("disabled", "");
  });
});
