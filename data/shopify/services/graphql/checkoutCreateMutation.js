import gql from "graphql-tag";
import { CheckoutFragment } from "./checkoutFragment";

export const checkoutCreateMutation = gql`
  ${CheckoutFragment}
  mutation($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        ...CheckoutFragment
      }
    }
  }
`;
