import { graphqlQuery } from './services/shopifyApolloClient'
import gql from 'graphql-tag'
import fetchProduct from './fetchProduct'

const query = gql`
  query ($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on ProductVariant {
        title
        product {
          handle
        }
      }
    }
  }
`

const fetchProductsByVariantIds = async (ids) => {
  const response = await graphqlQuery({
    query: query,
    variables: {
      ids: ids
    }
  })

  const handles = response.data.nodes.map((v) => v.product.handle)

  return await Promise.all(handles.map((handle) => fetchProduct(handle, false)))
}

export default fetchProductsByVariantIds
