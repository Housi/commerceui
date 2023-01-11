import gql from "graphql-tag";
import { VariantFragment } from "./variantFragment";
import { PRODUCT_FRAGMENT } from "./productFragment";

export const VariantWithProductFragment = gql`
  ${VariantFragment}
  ${PRODUCT_FRAGMENT}
  fragment VariantWithProductFragment on ProductVariant {
    ...VariantFragment
    product {
      ...ProductFragment
    }
  }
`;
