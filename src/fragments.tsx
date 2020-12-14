import { gql } from "@apollo/client";

export const RESTAURANT_FRAGMENT = gql`
  fragment RestaurantPart on Restaurant {
    id
    name
    coverImage
    category {
      id
      name
    }
    address
    isPromoted
  }
`;
