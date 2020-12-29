import { gql } from "@apollo/client";

export const RESTAURANT_FRAGMENT = gql`
  fragment RestaurantPart on Restaurant {
    id
    name
    coverImage
    category {
      id
      name
      slug
    }
    address
    isPromoted
  }
`;

export const CATEGORY_FRAGMENT = gql`
  fragment CategoryPart on Category {
    id
    slug
    name
    image
    restaurantsOn {
      count
    }
  }
`;

export const DISH_FRAGMENT = gql`
  fragment DishPart on Dish {
    id
    name
    price
    photo
    description
    options {
      name
      extra
      choices {
        name
        extra
      }
    }
  }
`;

export const ORDER_FRAGMENT = gql`
  fragment OrderPart on Order {
    id
    createAt
    totalCost
    restaurant {
      id
    }
    orderStatus
    driver {
      id
      email
    }
    customer {
      id
      email
    }
    orderItems {
      dish {
        id
        name
        price
      }
      options {
        extra
        name
        choices {
          name
          extra
        }
      }
    }
  }
`;

export const ORDERS_FRAGMENT = gql`
  fragment OrderPart on Order {
    id
    createAt
    totalCost
  }
`;

export const FULL_ORDER_FRAGMENT = gql`
  fragment FullOrderPart on Order {
    id
    orderStatus
    totalCost
    driver {
      id
      email
    }
    customer {
      id
      email
    }
    restaurant {
      name
      address
    }
  }
`;
