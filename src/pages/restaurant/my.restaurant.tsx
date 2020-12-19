import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import { QueryMyRestaurants } from "../../codegen/QueryMyRestaurants";
import { HelmetOnlyTitle } from "../../components/helmet.onlytitle";
import { RestaurantItem } from "../../components/restaurant.item";
import { RESTAURANT_FRAGMENT } from "../../fragments";

const GQL_MYRESTAURANTS = gql`
  query QueryMyRestaurants {
    myRestaurants {
      ok
      error
      count
      restaurants {
        ...RestaurantPart
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const MyRestaurant = () => {
  const { data, loading } = useQuery<QueryMyRestaurants>(GQL_MYRESTAURANTS);

  return (
    <div className="layout__container mt-20">
      <HelmetOnlyTitle title="Your Restaruants" />
      <h1 className="text-3xl font-semibbold">My Restaurants</h1>
      {loading ? (
        <div>Loading</div>
      ) : (
        <div>
          {!data?.myRestaurants.ok && (
            <div>
              <h1>Erros on fetching restaurant information</h1>
            </div>
          )}
          {data?.myRestaurants.ok &&
            (data?.myRestaurants.count === 0 ? (
              <div className="my-10">
                <h4 className="mb-5">You have no restaurant yet</h4>
                <Link to="/create-restaurant">
                  <p className="text-lime-600 font-semibold">Create one →</p>
                </Link>
              </div>
            ) : (
              <div className="my-10">
                {data?.myRestaurants.ok &&
                  data?.myRestaurants?.restaurants?.map((r) => (
                    <RestaurantItem restaurant={r} categoryShow={false} />
                  ))}
                <Link to="/create-restaurant">
                  <p className="auth__form_button rounded-lg text-center">
                    Create Restaurant
                  </p>
                </Link>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
