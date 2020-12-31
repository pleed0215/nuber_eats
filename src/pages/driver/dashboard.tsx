import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import googleMapReact from "google-map-react";
import { getCombinedModifierFlags } from "typescript";
import { map } from "cypress/types/bluebird";

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}

const Driver: React.FC<IDriverProps> = ({ lat, lng, $hover }) => (
  <div
    // @ts-ignore
    lng={lng}
    lat={lat}
    className="rounded-full w-8 h-8 bg-white flex justify-center items-center"
  >
    🚖
  </div>
);

export const DashBoard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lng: 0, lat: 0 });
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);
  const [googleMaps, setGoogleMaps] = useState<googleMapReact | null>(null);
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

  useEffect(() => {
    if (googleMap && googleMaps) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
        },
        (results, status) => {
          console.log("status", status);
          console.log("results", results);
        }
      );
    }
  }, [driverCoords.lat, driverCoords.lng]);

  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    setGoogleMap(map);
    setGoogleMaps(maps);
    map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
  };

  return (
    <div>
      <div className="" style={{ width: window.innerWidth, height: "50vh" }}>
        <GoogleMapReact
          defaultZoom={18}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          center={{ lng: driverCoords.lng, lat: driverCoords.lat }}
          bootstrapURLKeys={{ key: "AIzaSyBXMuO-0G-Lkxq_JDP1v9zG7VN4n2l5DdE" }}
        >
          <Driver lng={driverCoords.lng} lat={driverCoords.lat} />
        </GoogleMapReact>
      </div>
    </div>
  );
};
