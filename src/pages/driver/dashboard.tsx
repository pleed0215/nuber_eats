import React, { createRef, useEffect, useRef, useState } from "react";
import { gql, useMutation, useSubscription } from "@apollo/client";
import { FULL_ORDER_FRAGMENT } from "../../fragments";
import { OnCookedOrders } from "../../codegen/OnCookedOrders";
import { useHistory } from "react-router-dom";
import {
  MutationOrderPick,
  MutationOrderPickVariables,
} from "../../codegen/MutationOrderPick";
import { OrderStatus } from "../../codegen/globalTypes";
import { toast } from "react-toastify";
import { NaverMap, Marker, Polyline } from "react-naver-maps";
import jsonp from "jsonp";

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}

const NAVER_API_HOST = "http://my.yoyang.io:1111/routes";

const GQL_COOCKED_ORDERS = gql`
  subscription OnCookedOrders {
    cookedOrders {
      ...FullOrderPart
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const GQL_ORDER_PICKED = gql`
  mutation MutationOrderPick($id: Float!, $status: OrderStatus!) {
    updateOrder(id: $id, orderStatus: $status) {
      ok
      error
    }
  }
`;

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
  // @ts-ignore
  const naverMaps = window.naver.maps;

  const [driverCoords, setDriverCoords] = useState<ICoords>({ lng: 0, lat: 0 });
  const [destCoords, setDestCoords] = useState<ICoords>();

  // @ts-ignore
  const [destPath, setDestPath] = useState<naverMaps.LatLng[]>();
  const [mapRef, setMapRef] = useState<any>();
  const onSuccess = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setDriverCoords({ lng: longitude, lat: latitude });
  };
  const onError = (error: GeolocationPositionError) => {};

  const { data: cookedOrdersData } = useSubscription<OnCookedOrders>(
    GQL_COOCKED_ORDERS
  );
  const history = useHistory();
  const [pickOrder] = useMutation<
    MutationOrderPick,
    MutationOrderPickVariables
  >(GQL_ORDER_PICKED, {
    onCompleted: (data: MutationOrderPick) => {
      if (data.updateOrder.ok) {
        toast.success("Order picked up.");
        history.push(`/orders/${cookedOrdersData?.cookedOrders.id}`);
      }
    },
  });

  const onDesinationRecieved = () => {
    //https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query={주소}&coordinate=#{검색_중심_좌표}"
    naverMaps.Service.geocode(
      { query: "월배로 119" },
      async (status, response) => {
        if (status === naverMaps.Service.Status.Error) {
          console.log("error");
        } else {
          const {
            v2: { addresses },
          } = response;
          const lat = addresses[0].y,
            lng = addresses[0].x;
          setDestCoords({ lat, lng });
          const result = await (
            await fetch(
              `${NAVER_API_HOST}?start=${driverCoords.lng},${driverCoords.lat}&goal=${lng},${lat}`
            )
          ).json();
          const {
            route: { traoptimal },
          } = result;
          const { guide, path } = traoptimal[0];
          setDestPath(path.map((p) => new naverMaps.LatLng(p[1], p[0])));
          const fitBounds = new naverMaps.LatLngBounds(
            new naverMaps.LatLng(driverCoords.lat, driverCoords.lng),
            new naverMaps.LatLng(lat, lng)
          );

          // @ts-ignore
          mapRef.fitBounds(fitBounds);
          mapRef.setZoom(16);
        }
      }
    );
  };

  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });
  }, []);

  useEffect(() => {
    /* 위치가 바뀔 때*/
  }, [driverCoords.lat, driverCoords.lng]);

  useEffect(() => {
    if (cookedOrdersData?.cookedOrders?.id) {
    }
    return () => {};
  }, [cookedOrdersData]);

  return (
    <div className="h-full">
      <div
        id="react-naver-map"
        className=""
        style={{ width: window.innerWidth, height: "50vh" }}
      >
        <NaverMap
          naverRef={(ref) => {
            setMapRef(ref);
          }}
          mapDivId={"react-naver-map"}
          className="w-full h-half"
          defaultCenter={{ lat: driverCoords.lat, lng: driverCoords.lng }}
          center={driverCoords}
          defaultZoom={17}
        >
          <Marker
            position={new naverMaps.LatLng(driverCoords.lat, driverCoords.lng)}
            title="현재위치"
          />
          {destCoords && (
            <Marker
              position={new naverMaps.LatLng(destCoords.lat, destCoords.lng)}
              title="배달위치"
            />
          )}
          {destCoords && destPath && (
            <Polyline
              path={destPath}
              // clickable // 사용자 인터랙션을 받기 위해 clickable을 true로 설정합니다.
              strokeColor={"#5347AA"}
              strokeOpacity={0.9}
              strokeWeight={5}
            />
          )}
        </NaverMap>
      </div>
      <div>
        {cookedOrdersData?.cookedOrders.restaurant ? (
          <div className=" max-w-screen-sm  mx-auto bg-white shadow-lg py-8 px-5 z-50 mt-4">
            <h1 className="text-center text-3xl font-medium">
              New Cooked order
            </h1>
            <h4 className="text-center my-3 text-2xl font-medium">
              Pick it up soon @{" "}
              {cookedOrdersData?.cookedOrders.restaurant?.name}
            </h4>
            <button
              className="auth__form_button w-full block text-center mt-5"
              onClick={async () =>
                await pickOrder({
                  variables: {
                    id: cookedOrdersData?.cookedOrders.id,
                    status: OrderStatus.Pickedup,
                  },
                })
              }
            >
              Accept Challenge &rarr;
            </button>
          </div>
        ) : (
          <div
            className=" max-w-screen-sm  mx-auto bg-white relative -top-10  z-50 shadow-lg py-8 px-5"
            onClick={() => onDesinationRecieved()}
          >
            <h1 className="text-center text-3xl font-medium">No orders yet</h1>
          </div>
        )}
      </div>
    </div>
  );
};
