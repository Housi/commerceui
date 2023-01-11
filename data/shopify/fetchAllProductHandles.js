import shopifyApolloClient, {graphqlQuery} from './services/shopifyApolloClient'
import {fetchProductsHandlesQuery} from './services/graphql/fetchProductsHandlesQuery'
import {removeEdges} from './mapHelpers'

async function fetchAllProductHandles() {

  const query = async () => {

    let products = {
      edges: []
    };

    let lastProductCursor = null;
    let hasNextPage = false;

    do {
      const {data} = await graphqlQuery({
        query: fetchProductsHandlesQuery,
        variables: {
          query: '',
          sortKey: 'CREATED_AT',
          sortIndex: 0,
          reverse: false,
          first: 250,
          cursor: lastProductCursor
        }
      });
      products.edges = [...products.edges, ...data.products.edges];

      hasNextPage = data.products.pageInfo.hasNextPage;
      if(hasNextPage) {
        lastProductCursor = data.products.edges[data.products.edges.length - 1].cursor;
      }

    } while (hasNextPage);

    return removeEdges(products).map(p => ({handle: p.handle}) );

  };

  const responses = await Promise.all([
    query()
  ]);

  return responses.flat()
}

export default fetchAllProductHandles
