import { graphqlQuery } from './services/shopifyApolloClient'
import { fetchProductByHandleQuery, fetchProductByHandleQuerySlim } from './services/graphql/fetchProductQuery'
import { mapProduct } from './mapHelpers'
import fetchProducts from './fetchProducts.js'
import fetchProductsByHandle from './fetchProductsByHandle'

async function fetchProductByHandle(handle, useCardQuery = false) {
  const { data } = await graphqlQuery({
    query: useCardQuery ? fetchProductByHandleQuerySlim : fetchProductByHandleQuery,
    variables: {
      handle
    }
  })

  if (!data) {
    console.log("(fetchProductByHandle) Handle doesn't exist in Shopify: " + handle)
    return null
  }

  return data.productByHandle
}

async function fetchProduct(handle, attachStylesWith = true) {
  const responses = await Promise.all([fetchProductByHandle(handle, !attachStylesWith)])

  let product = responses[0]

  if (!product) {
    return null
  }

  product = mapProduct(product)

  const TITLE_SEPARATOR = ' - '

  const titleBase = product.title.split(TITLE_SEPARATOR)[0]
  const query = `title:'${titleBase} - '* `

  const relatedProducts = await fetchProducts({ query })

  const relatedProductsWithoutSets = relatedProducts.filter(
    (p) => p.originalTitle.split(TITLE_SEPARATOR)[0] === titleBase
  )

  let stylesWithProducts = []
  let bundlePieces = []

  // We don't want recursion here, hence the flag.
  if (attachStylesWith && product.stylesWith && product.enableStylesWith) {
    stylesWithProducts = await fetchProductsByHandle(product.stylesWith)
  }
  if (attachStylesWith && product.bundlePieces) {
    bundlePieces = await fetchProductsByHandle(product.bundlePieces)
  }

  return {
    ...product,
    relatedProducts: relatedProductsWithoutSets,
    bundlePieces,
    stylesWithProducts
  }
}
export default fetchProduct
