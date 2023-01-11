import gql from "graphql-tag";

// ModelName - is just a ModelName
// ModelNameConnection - is ModelName + pagination data

export const IMAGE_FRAGMENT = gql`
  fragment ImageFragment on Image {
    id
    originalSrc
    altText
  }
`;
