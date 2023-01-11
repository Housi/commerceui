import gql from "graphql-tag";
import { CheckoutFragment } from "./checkoutFragment";

export const fetchCheckoutQuery = gql`
  ${CheckoutFragment}
  query($id: ID!) {
    node(id: $id) {
      ...CheckoutFragment
    }
  }
`;
