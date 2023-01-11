import shopifyApolloClient from './shopifyApolloClient'
import { removeEdges } from '../mapHelpers'

import { fetchCheckoutQuery } from './graphql/fetchCheckoutQuery'
import { checkoutCreateMutation } from './graphql/checkoutCreateMutation'
import { checkoutLineItemsReplaceMutation } from './graphql/checkoutLineItemsReplaceMutation'
import { mapCheckoutProduct } from '../mapHelpers'

function checkoutIdKey() {
  return 'checkoutId_'
}

const checkoutEntity = async (checkout) => {
  const lineItems = removeEdges(checkout?.lineItems).map(lineItem => {
    const mappedProduct = mapCheckoutProduct(lineItem.variant.product)
    const variant = {
      ...lineItem.variant,
      size: { id: lineItem.variant.title, label: lineItem.variant.title },
    }

    return {
      ...lineItem,
      variant: {
        ...variant,
        productId: mappedProduct.id,
        productHandle: mappedProduct.handle,
        product: mappedProduct
      },
      product: mappedProduct
    }
  })

  return ({
    order: checkout.order,
    subtotalPrice: checkout?.subtotalPriceV2,
    totalPrice: checkout?.totalPriceV2,
    shippingPrice: checkout?.shippingLine?.priceV2 ?? null, // nullable! if shippingMethod was not picked in current session, then it's null
    lineItems,
    currencyCode: checkout?.currencyCode,
    checkoutUrl: checkout?.webUrl // url to Shopify checkout
  })
}


async function createCheckout(input = {}) {
  const results = await shopifyApolloClient().mutate({
    mutation: checkoutCreateMutation,
    variables: {
      input
    }
  })

  const { data } = results
  const id = data?.checkoutCreate?.checkout?.id
  localStorage.setItem(checkoutIdKey(), id)

  return checkoutEntity(data?.checkoutCreate?.checkout)
}

export async function fetchCheckout(id) {
  const results = await shopifyApolloClient().query({
    query: fetchCheckoutQuery,
    variables: {
      id
    }
  });

  if (results.data.node === null) {
    return null;
  }

  return checkoutEntity(results.data.node)
}

export async function fetchOrCreateCheckout(shouldCreate = true) {
  const id = localStorage.getItem(checkoutIdKey());

  if (id) {
    const checkout = await fetchCheckout(id);

    if (checkout) {
      if(checkout.order && checkout.order.financialStatus === "PAID") {
        return createCheckout()
      }
      return checkout
    }

  }

  if (shouldCreate) {
    return createCheckout()
  } else {
    return null
  }
}

export async function replaceLineItems(lineItems = [], signal = null) {
  // console.log('###replaceLineItems lineItems', lineItems)

  // let t1 = new Date();
  const checkoutId = localStorage.getItem(checkoutIdKey());

  if (!checkoutId) {
    throw new Error('No checkout id detected! Please use fetchOrCreateCheckout() first.')
  }

  const variables = {
    checkoutId,
    lineItems,
  }

  try {
    const results = await shopifyApolloClient().mutate({
      mutation: checkoutLineItemsReplaceMutation,
      variables,
      context: {
        fetchOptions: {
          signal
        }
      },
      fetchPolicy: 'no-cache'
    })
    // console.log('###replaceLineItems results', results.data.checkoutLineItemsReplace.checkout.lineItems)
    // let t2 = new Date();
    // console.log(`replaceLineItems ${t2 - t1}ms`)
    return checkoutEntity(results?.data?.checkoutLineItemsReplace?.checkout)
  } catch (error) {
    console.log(error)
    return
  }
}
