import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";

interface ICoords {
  lat: number;
  lng: number;
}

export const DashBoard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lng: 0, lat: 0 });
  const onSuccess = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setDriverCoords({ lng: longitude, lat: latitude });
  };
  const onError = (error: GeolocationPositionError) => {};

  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });
  }, []);

  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    console.log(map, maps);
    map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
  };

  return (
    <div>
      <div
        className="py-52"
        style={{ width: window.innerWidth, height: "95vh" }}
      >
        <GoogleMapReact
          defaultZoom={15}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          center={{ lng: driverCoords.lng, lat: driverCoords.lat }}
          bootstrapURLKeys={{ key: "AIzaSyAFfTNEcNEfK2kEevlA7yQgJEpT2-zfFr8" }}
        ></GoogleMapReact>
      </div>
    </div>
  );
};
