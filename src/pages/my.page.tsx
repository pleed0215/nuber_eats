import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { OrderStatus } from "../codegen/globalTypes";
import {
  QueryGetAllOrders,
  QueryGetAllOrders_getAllOrders_orders,
} from "../codegen/QueryGetAllOrders";
import { FULL_ORDER_FRAGMENT } from "../fragments";

const GQL_GET_ALL_ORDERS = gql`
  query QueryGetAllOrders {
    getAllOrders {
      ok
      error
      orders {
        ...FullOrderPart
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

export const MyPage = () => {
  const {
    data: allOrders,
    loading: allOrdersLoading,
    error,
  } = useQuery<QueryGetAllOrders>(GQL_GET_ALL_ORDERS);

  return (
    <div className="layout__container mt-3">
      <div className="w-full flex flex-col">
        <Link to="/me" className="auth__form_button text-center mb-2">
          Go to profile page
        </Link>
        <div className="flex flex-col w-full">
          <h1 className="text-2xl italic mb-4">Your oders</h1>
          <hr />
          <div className="px-2 w-1/2 mt-4 self-center">
            <div className="flex flex-col items-center">
              {!allOrdersLoading &&
                allOrders &&
                allOrders.getAllOrders.orders?.map((order) => (
                  <div className="w-full mb-4 flex flex-col items-center justify-start">
                    <div className="w-full py-2 bg-gray-700 text-white text-center">
                      Order: #{order.id}
                    </div>
                    <div className="w-full h-full border border-gray-200 p-3">
                      <ul>
                        <li>
                          <p>Order Status: {order.orderStatus}</p>
                        </li>
                        <li>
                          <p>Total Cost: ${order.totalCost}</p>
                        </li>
                        <li>
                          <p>Order from: {order.restaurant?.name} </p>
                          <p className="pl-4">
                            - Address: {order.restaurant?.address}
                          </p>
                        </li>
                        <li>
                          <p>
                            Deliver:{" "}
                            {order.driver ? order.driver?.email : "Not yet"}
                          </p>
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
