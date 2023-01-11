import {graphqlQuery} from './services/shopifyApolloClient'
import {fetchProductsQuery} from './services/graphql/fetchProductsQuery'
import {removeEdges, mapProduct} from './mapHelpers'

async function fetchProducts({ query = '', globalSettings}) {


  const responses = await Promise.all([
    graphqlQuery({
      query: fetchProductsQuery,
      variables: {
        query,
        sortKey: 'CREATED_AT',
        sortIndex: 0,
        reverse: false,
        first: 250,
      }
    })
  ]);

  const products =
    removeEdges(responses[0].data.products)
    .map(mapProduct);

  return products;

}


export default fetchProducts