import {ApolloClient} from 'apollo-client';
import {createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import {InMemoryCache, IntrospectionFragmentMatcher} from 'apollo-cache-inmemory'
import fetch from 'isomorphic-fetch';
import introspectionQueryResultData from './fragmentTypes.json';

const customFetch = (uri, options) => {
  return fetch(uri, options).catch(error => {
    console.log("\x1b[31m", 'customFetch error');
    console.log("\x1b[31m", "###ERROR" + error);
    const stringifiedError = new String(error);
    if (stringifiedError.includes('aborted')) {
        throw new Error('Aborted')
    }
    throw error
  })
};

const defaultOptions = {
    watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
    },
    query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    },
}

let shopifyApolloClient;

const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData
});


export function initializeShopifyApolloClient() {
  if (typeof window === "object" && shopifyApolloClient) { // Don't reinitialize on the browser when instance was already created
    return;
  }

    const config = {
      token: process.env.NEXT_PUBLIC_ENV_STORE_FRONT_ACCESS_TOKEN,
      uri: process.env.NEXT_PUBLIC_ENV_URI
    };

    const httpLink = createHttpLink({
        uri: config.uri,
        fetch: customFetch
    });

    const middlewareLink = setContext(() => {
        return {
            headers: {
                'X-Shopify-Storefront-Access-Token': config.token
            }
        }
    });

    // If IS_BUILD === true, we want caching to prevent calling Shopify API all the time with the same requests.
    // However, IS_BUILD should be false in the browser and particularly during static site regeneration (inMemoryCache would prevent from updating data)

    let cache = new InMemoryCache({
        fragmentMatcher,
        resultCaching: process.env.IS_BUILD === "true"
    });

    shopifyApolloClient = new ApolloClient({
        link: middlewareLink.concat(httpLink),
        cache,
        defaultOptions
    });
}

const shopifyApolloGetter = () => {

    if (!shopifyApolloClient) {
        initializeShopifyApolloClient()
    }

    return shopifyApolloClient;
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function graphqlQuery(queryParams) {
    const client = shopifyApolloGetter();

    let isFirst = true;
    let response;

    do {
        if (!isFirst) {
            console.log(`Error while fetching from Shopify, sleeping 5s...`, queryParams);
            await sleep(5000);
            console.log('Wake up');
        }

        response = await client.query(queryParams);

        if (response.errors) {
            console.log("\x1b[31m","###RESPONSE ERRORS" + JSON.stringify(response.errors));
        }

        // console.log('data fetch finished');

        isFirst = false;

    } while (!response.data);

    return response;
}

export default shopifyApolloGetter

