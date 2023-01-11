import gql from "graphql-tag";
import { COLLECTIONS_FRAGMENT } from "./collectionFragment";

export const fetchCollectionsQuery = gql`
  query collections {
    collections(first: 250) {
        edges {
            node {
                id
                handle
            }
        }
    }
  }
`;
