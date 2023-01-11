import gql from "graphql-tag";
import { PRODUCT_FRAGMENT } from "./productFragment";

export const fetchProductsByIdsQuery = gql`
  ${PRODUCT_FRAGMENT}
  query nodes($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        ...ProductFragment
      }
    }
  }
`;
