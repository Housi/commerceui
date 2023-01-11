import gql from "graphql-tag";
import { PRODUCTS_FRAGMENT } from "./productFragment";

export const COLLECTION_FRAGMENT = gql`
  ${PRODUCTS_FRAGMENT}
  fragment CollectionFragment on Collection {
    title
    id
    handle
    descriptionHtml
    description
    image {
      id
      originalSrc
      altText
    }
    products(first: 250, after: $lastProductCursor) {
      ...ProductsFragment
    }
  }
`;

export const COLLECTIONS_FRAGMENT = gql`
  ${COLLECTION_FRAGMENT}
  fragment CollectionsFragment on CollectionConnection {
    edges {
      node {
        ...CollectionFragment
      }
    }
  }
`;
