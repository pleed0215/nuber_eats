import React, { createContext, useEffect, useState } from "react";
import { LoggedInRouter } from "./routers/logged-in-router";
import { LoggedOutRouter } from "./routers/logged-out-router";
import { isLoggedInVar } from "./apollo";
import { useReactiveVar } from "@apollo/client";

export interface ICoords {
  lat: number;
  lng: number;
}

export const PositionContext = createContext<ICoords>(null);

function App() {
  const [currentCoords, setCurrentCoords] = useState<ICoords>({
    lng: 0,
    lat: 0,
  });
  const onSuccess = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setCurrentCoords({ lng: longitude, lat: latitude });
  };
  const onError = (error: GeolocationPositionError) => {};

  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });
  }, []);

  const isLoggedIn = useReactiveVar(isLoggedInVar);

  return (
    <PositionContext.Provider value={currentCoords}>
      {isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />}
    </PositionContext.Provider>
  );
}

export default App;
