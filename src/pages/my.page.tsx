import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import { QueryGetAllOrders } from "../codegen/QueryGetAllOrders";
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
  const { data: allOrders, loading } = useQuery<QueryGetAllOrders>(
    GQL_GET_ALL_ORDERS
  );

  return (
    <div className="layout__container mt-3">
      <div className="w-full flex flex-col">
        <Link to="/me" className="auth__form_button text-center mb-2">
          Go to profile page
        </Link>
        <div className="flex flex-col w-full">
          <h1 className="text-2xl italic mb-4">Your oders</h1>
          <hr />
          <div className="px-2 w-full mt-4">
            <h4 className="text-xl">Current orders</h4>
            <div className="grid grid-cols-3 gap-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
