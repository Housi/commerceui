import gql from "graphql-tag";
import { VariantWithProductFragment } from "./variantWithProductFragment";

export const CheckoutFragment = gql`
  ${VariantWithProductFragment}
  fragment CheckoutFragment on Checkout {
    id
    webUrl
    currencyCode
    totalPriceV2 {
      amount
      currencyCode
    }
    subtotalPriceV2 {
      amount
      currencyCode
    }
    ready
    lineItems(first: 250) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          id
          title
          variant {
            ...VariantWithProductFragment
          }
          quantity
          customAttributes {
            key
            value
          }
          discountAllocations {
            allocatedAmount {
              amount
              currencyCode
            }
            discountApplication {
              ... on ScriptDiscountApplication {
                title
                allocationMethod
                targetSelection
                targetType
              }
            }
          }
        }
      }
    }
    order {
      financialStatus
      fulfillmentStatus
    }
    # requiresShipping
    # orderStatusUrl
    # taxExempt
    # taxesIncluded
    # totalTax
    # totalTaxV2 {
    #   amount
    #   currencyCode
    # }
    # lineItemsSubtotalPrice {
    #   amount
    #   currencyCode
    # }
    # totalPrice
    # completedAt
    # createdAt
    # updatedAt
    # email
    # discountApplications(first: 10) {
    #   pageInfo {
    #     hasNextPage
    #     hasPreviousPage
    #   }
    #   edges {
    #     node {
    #       ...DiscountApplicationFragment
    #     }
    #   }
    # }
    # TODO: do we need it
    # appliedGiftCards {
    #   ...AppliedGiftCardFragment
    # }
    # shippingAddress {
    #   ...MailingAddressFragment
    # }
    # shippingLine {
    #   handle
    #   price
    #   priceV2 {
    #     amount
    #     currencyCode
    #   }
    #   title
    # }
    # customAttributes {
    #   key
    #   value
    # }
  }
`;
