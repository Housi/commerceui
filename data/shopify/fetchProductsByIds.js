import { fetchProductsByIdsQuery } from './services/graphql/fetchProductsByIdsQuery'
import { mapProduct } from './mapHelpers'
import {graphqlQuery} from "./services/shopifyApolloClient";

async function fetchProductsByIds(ids = []) {

  const responses = await Promise.all([
    graphqlQuery({
      query: fetchProductsByIdsQuery,
      variables: {
        ids: ids
      }
    })
  ]);

   return responses[0].data.nodes.map(mapProduct)
}

export default fetchProductsByIds
