import gql from "graphql-tag";
import { CheckoutFragment } from "./checkoutFragment";

export const checkoutLineItemsReplaceMutation = gql`
  ${CheckoutFragment}

  mutation($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
    checkoutLineItemsReplace(checkoutId: $checkoutId, lineItems: $lineItems) {
      # userErrors {
      #   ...CheckoutUserErrorFragment
      # }
      checkout {
        ...CheckoutFragment
      }
    }
  }
`;
