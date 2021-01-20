import React, { useContext, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useMe, GQL_QUERY_ME } from "../../hooks/useMe";
import { NaverMap, Marker, Polyline } from "react-naver-maps";
import { ICoords, PositionContext } from "../../App";
import { useScript } from "../../hooks/useScript";
import { gql, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const MutationUpdateAddress = gql`
  mutation QueryUpdateAddress($address: String!) {
    updateProfile(update: { address: $address }) {
      ok
      error
    }
  }
`;

interface IForm {
  address: string;
  zonecode: string;
}

export const SetAddress: React.FC = () => {
  const me = useMe();
  const history = useHistory();
  // @ts-ignore
  const naverMaps = window.naver.maps;
  const {
    register,
    getValues,
    setValue,
    control,
    handleSubmit,
  } = useForm<IForm>();
  const address = useWatch({ control, name: "address" });
  const [addressCoords, setAddressCoords] = useState<ICoords>(null);
  const [mapRef, setMapRef] = useState<any>();
  const currentCoords = useContext(PositionContext);
  const [updateAddress, { loading: updateLoading }] = useMutation(
    MutationUpdateAddress,
    {
      onCompleted: (data) => {
        if (data.updateProfile.ok) {
          toast.success("Address successfully updated.");
          history.push("/");
        }
      },
    }
  );
  let daumPostcode = null;

  const onUpdateAddress = async () => {
    const address = getValues("address");
    if (me && address !== "" && me.data.me.address !== address) {
      await updateAddress({
        variables: {
          address,
        },
        refetchQueries: [
          {
            query: GQL_QUERY_ME,
          },
        ],
      });
    }
  };

  const onPostcodeComplete = (data) => {
    // daum post code 이용방법
    // http://postcode.map.daum.net/guide#usage

    if (data) {
      console.log(data);
      setValue("address", data.roadAddress);
      setValue("zonecode", data.zonecode);
    }
  };
  useScript(
    "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
  );

  useEffect(() => {
    if (me) {
      setValue("address", me.data.me.address);
    }
  }, [me]);

  const onPostcodeClick = () => {
    // @ts-ignore
    new daum.Postcode({
      oncomplete: onPostcodeComplete,
    }).open();
  };

  useEffect(() => {
    if (address && address !== "") {
      naverMaps.Service.geocode(
        { query: address },
        async (status, response) => {
          if (status === naverMaps.Service.Status.Error) {
            console.log("error");
          } else {
            const {
              v2: { addresses },
            } = response;
            if (addresses.length > 0) {
              console.log("response", response);
              const lat = addresses[0].y,
                lng = addresses[0].x;
              setAddressCoords({ lat, lng });
            } else {
              toast.error(
                "Fetching address is failed. It is maybe naver maps api(geocoder) problem.."
              );
            }
          }
        }
      );
    }
  }, [address]);

  return (
    <div className="layout__container flex flex-col">
      <h4 className="text-xl mb-2">Input your address, click zoncode button</h4>
      <form onSubmit={handleSubmit(onUpdateAddress)} className="w-full mb-8">
        <div className="flex mb-2">
          <input
            className="auth__form_input mr-2 w-32"
            ref={register()}
            type="text"
            name="zonecode"
            placeholder="Zonecode"
            readOnly
          />
          <span
            className="auth__form_button mt-0 cursor-pointer"
            onClick={() => onPostcodeClick()}
          >
            Zonecode
          </span>
        </div>
        <input
          className="auth__form_input"
          ref={register({ required: true })}
          type="text"
          name="address"
          placeholder="Address"
          readOnly
        />
        <div className="w-full flex justify-center">
          <input
            type="submit"
            className="auth__form_button cursor-pointer"
            value={updateLoading ? "Updating..." : "Update address"}
          />
        </div>
      </form>
      <div id="address-map">
        <NaverMap
          naverRef={(ref) => {
            setMapRef(ref);
          }}
          mapDivId={"react-naver-map"}
          className="w-full h-half"
          defaultCenter={{ lat: currentCoords.lat, lng: currentCoords.lng }}
          center={addressCoords ? addressCoords : currentCoords}
          defaultZoom={17}
        >
          <Marker
            position={
              !addressCoords
                ? new naverMaps.LatLng(currentCoords.lat, currentCoords.lng)
                : new naverMaps.LatLng(addressCoords.lat, addressCoords.lng)
            }
            title="현재위치"
          />
        </NaverMap>
      </div>
    </div>
  );
};
