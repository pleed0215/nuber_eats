import { render, waitFor } from "@testing-library/react";
import React from "react";
import { isLoggedInVar } from "./apollo";

import App from "./App";

jest.mock("./routers/logged-out-router", () => {
  return {
    LoggedOutRouter: () => <span>logged-out</span>,
  };
});

jest.mock("./routers/logged-in-router", () => {
  return {
    LoggedInRouter: () => <span>logged-in</span>,
  };
});

describe("<App />", () => {
  it("logged out OK", () => {
    const { getByText } = render(<App />);
    getByText("logged-out");
  });

  it("logged in OK", async () => {

    await waitFor( () => {
      isLoggedInVar(true);
    })
    
    const { getByText } = render(<App />);
    getByText("logged-in");
  });
});
