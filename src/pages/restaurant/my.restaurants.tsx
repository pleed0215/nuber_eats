import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import { QueryMyRestaurants } from "../../codegen/QueryMyRestaurants";
import { HelmetOnlyTitle } from "../../components/helmet.onlytitle";
import { RestaurantItem } from "../../components/restaurant.item";
import { RESTAURANT_FRAGMENT } from "../../fragments";

export const GQL_MYRESTAURANTS = gql`
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

export const MyRestaurants = () => {
  const { data, loading } = useQuery<QueryMyRestaurants>(GQL_MYRESTAURANTS);

  return (
    <div className="layout__container mt-20 pb-10">
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
              <div>
                {data.myRestaurants.count < 3 && (
                  <Link to="/create-restaurant">
                    <p className="auth__form_button rounded-lg text-center mb-8">
                      Create Restaurant
                    </p>
                  </Link>
                )}
                <div className="layout__container grid lg:grid-cols-3 md:grid-cols-2  sm:grid-cols-1 gap-4 mt-10">
                  {data?.myRestaurants.ok &&
                    data?.myRestaurants?.restaurants?.map((r) => (
                      <div key={r.id} className="flex flex-col">
                        <RestaurantItem
                          restaurant={r}
                          categoryShow={false}
                          linkPrefix="my-restaurant"
                        />
                        <div className="flex justify-around text-center">
                          <Link
                            className="w-1/3 bg-lime-200 text-lime-600 rounded-md px-3 py-1 hover:text-lime-200 hover:bg-lime-600 transition duration-200"
                            to={`/my-restaurant/${r.id}/update`}
                          >
                            Edit
                          </Link>
                          <Link
                            className="w-1/3 bg-red-200 text-red-600 rounded-md px-3 py-1 hover:text-red-200 hover:bg-red-600 transition duration-200"
                            to=""
                          >
                            Remove
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
