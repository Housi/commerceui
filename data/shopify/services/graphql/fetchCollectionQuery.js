import gql from "graphql-tag";
import { COLLECTION_FRAGMENT } from "./collectionFragment";

export const fetchCollectionByHandleQuery = gql`
  ${COLLECTION_FRAGMENT}
  query collectionByHandle($handle: String!, $lastProductCursor: String) {
    collectionByHandle(handle: $handle) {
      ...CollectionFragment
    }
  }
`;
