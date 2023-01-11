import shopifyApolloClient, { graphqlQuery } from './services/shopifyApolloClient'
import { fetchCollectionsQuery } from './services/graphql/fetchCollectionsQuery'
import { removeEdges } from './mapHelpers'

async function fetchAllCollectionHandles(variables = {}) {

   const query = async () => {
      const {data} = await graphqlQuery({
         query: fetchCollectionsQuery,
         variables
      });
      return removeEdges(data.collections).map(collection => ({handle: collection.handle}) );
   };

   const responses = await Promise.all([
     query()
   ]);

   return responses.flat()
}

export default fetchAllCollectionHandles
