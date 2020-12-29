import { gql, useQuery, useSubscription } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import {
  OnOrderUpdate,
  OnOrderUpdateVariables,
} from "../codegen/OnOrderUpdate";
import {
  QueryOrderDetail,
  QueryOrderDetailVariables,
} from "../codegen/QueryOrderDetail";
import { HelmetOnlyTitle } from "../components/helmet.onlytitle";
import { FULL_ORDER_FRAGMENT } from "../fragments";

interface IParams {
  id: string;
}

const GQL_GET_ORDER = gql`
  query QueryOrderDetail($id: Int!) {
    orderDetail(id: $id) {
      ok
      error
      order {
        ...FullOrderPart
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const GQL_ON_ORDER = gql`
  subscription OnOrderUpdate($orderId: Float!) {
    orderUpdate(orderId: $orderId) {
      ...FullOrderPart
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

export const Order = () => {
  const { id } = useParams<IParams>();
  const { data, loading, error } = useQuery<
    QueryOrderDetail,
    QueryOrderDetailVariables
  >(GQL_GET_ORDER, {
    variables: {
      id: +id,
    },
  });

  const { data: orderUpdateData, loading: loadingOnOrder } = useSubscription<
    OnOrderUpdate,
    OnOrderUpdateVariables
  >(GQL_ON_ORDER, {
    variables: {
      orderId: +id,
    },
  });

  console.log(orderUpdateData);

  return (
    <div className="layout__container mt-32 flex justify-center items-center">
      <HelmetOnlyTitle title="Order Detail" />
      {loading ? (
        <div className="w-screen h-screen flex justify-content items-center">
          <h1>Loading...</h1>
        </div>
      ) : error || !data?.orderDetail.ok ? (
        <div className="w-screen h-screen flex justify-content items-center">
          <h1>Data fetching error</h1>
        </div>
      ) : (
        <div className="w-1/2 max-w-lg min-w-max flex flex-col items-center border border-gray-700">
          <div className="w-full text-center py-2 mx-auto bg-gray-700 text-white">
            Order #{data?.orderDetail?.order?.id}
          </div>
          <div className="w-full py-3 px-4 bg-white flex flex-col items-center justify-start">
            <div className=" w-full py-4 text-center text-xl border-b border-gray-700">
              ${data?.orderDetail?.order?.totalCost}
            </div>
            <div className=" w-full py-4 border-b border-gray-700">
              Prepared By: {data?.orderDetail?.order?.restaurant?.name}
            </div>
            <div className=" w-full py-4 border-b border-gray-700">
              Deliver To: {data?.orderDetail?.order?.customer?.email}
            </div>
            <div className=" w-full py-4 border-b border-gray-700">
              driver:&nbsp;
              {data?.orderDetail?.order?.driver === null
                ? "Not yet"
                : data?.orderDetail?.order?.driver?.email}
            </div>
            <div className=" w-full py-8 text-center text-lime-500 font-semibold text-lg">
              Status:{" "}
              {orderUpdateData?.orderUpdate
                ? orderUpdateData.orderUpdate.orderStatus
                : data?.orderDetail?.order?.orderStatus}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
