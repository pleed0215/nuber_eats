import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ApolloProvider } from "@apollo/client";

import { apolloClient } from "./apollo";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HelmetProvider } from "react-helmet-async";
import { RenderAfterNavermapsLoaded } from "react-naver-maps";
ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <HelmetProvider>
        {/*제대로 작동 안함.
        <RenderAfterNavermapsLoaded
          ncpClientId={process.env.REACT_APP_NCLOUD_MAP_CLIENT_ID}
          error={<p>Maps Load Error</p>}
          loading={<p>Maps Loading...</p>}
          submodule={["geocoder"]}
        >*/}
        <div className="pb-10">
          <App />
          <ToastContainer position={toast.POSITION.BOTTOM_LEFT} />
        </div>
      </HelmetProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
