import gql from 'graphql-tag'
import { VariantFragment } from './variantFragment'

export const PRODUCT_FRAGMENT = gql`
  ${VariantFragment}
  fragment ProductFragment on Product {
    id
    handle
    description
    descriptionHtml
    tags
    productType
    publishedAt
    vendor
    collections(first: 10) {
      edges {
        node {
          title
        }
      }
    }
    enableStylesWith: metafield(namespace: "airf", key: "enb_rltd") {
      value
    }
    stylesWith: metafield(namespace: "airf", key: "r_products") {
      value
    }
    bundleDiscount: metafield(namespace: "airf", key: "b_discount") {
      value
    }
    bundlePieces: metafield(namespace: "airf", key: "b_products") {
      value
    }
    bundleMessage: metafield(namespace: "airf", key: "b_message") {
      value
    }
    detailsHtml: metafield(namespace: "airf", key: "p_details") {
      value
    }
    preorderInfo: metafield(namespace: "airf", key: "pre_info") {
      value
    }
    featuredImage: metafield(namespace: "airf", key: "feat_img") {
      value
    }
    featuredImageManualCollection: metafield(namespace: "airf", key: "man_col") {
      value
    }
    featuredImageAutomatedCollection: metafield(namespace: "airf", key: "auto_col") {
      value
    }
    variants(first: 100) {
      edges {
        node {
          ...VariantFragment
        }
      }
    }
    title
    images(first: 20) {
      edges {
        node {
          originalSrc
          id
          altText
        }
      }
    }
    media(first: 20) {
      edges {
        node {
          mediaContentType
          alt
          ... on MediaImage {
            image {
              originalSrc
              id
            }
          }
          ... on Video {
            sources {
              url
              mimeType
              format
              height
              width
            }
          }
        }
      }
    }
  }
`
export const PRODUCT_FRAGMENT_SLIM = gql`
  ${VariantFragment}
  fragment ProductFragmentSlim on Product {
    id
    handle
    tags
    productType
    publishedAt
    title
    descriptionHtml
    vendor
    collections(first: 10) {
      edges {
        node {
          title
        }
      }
    }
    detailsHtml: metafield(namespace: "airf", key: "p_details") {
      value
    }
    bundleMessage: metafield(namespace: "airf", key: "b_message") {
      value
    }
    featuredImage: metafield(namespace: "airf", key: "feat_img") {
      value
    }
    featuredImageManualCollection: metafield(namespace: "airf", key: "man_col") {
      value
    }
    featuredImageAutomatedCollection: metafield(namespace: "airf", key: "auto_col") {
      value
    }
    bundlePieces: metafield(namespace: "airf", key: "b_products") {
      value
    }
    variants(first: 100) {
      edges {
        node {
          ...VariantFragment
        }
      }
    }
    images(first: 20) {
      edges {
        node {
          originalSrc
          id
          altText
        }
      }
    }
  }
`

export const PRODUCTS_FRAGMENT = gql`
  ${PRODUCT_FRAGMENT_SLIM}
  fragment ProductsFragment on ProductConnection {
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    edges {
      cursor
      node {
        ...ProductFragmentSlim
      }
    }
  }
`
