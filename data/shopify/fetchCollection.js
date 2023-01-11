import { graphqlQuery } from './services/shopifyApolloClient'

import { fetchCollectionByHandleQuery } from './services/graphql/fetchCollectionQuery'
import { mapCollection } from './mapHelpers'
import filterCollectionFunction from '../../components/_pages/Collection/filterCollection'
import fetchProducts from './fetchProducts'
import fetchGlobalSettings from '../contentful/fetchGlobalSettings'

async function fetchCollectionByHandle(handle) {
  let collection = null
  let collectionProducts = []

  let lastProductCursor = null
  let hasNextPage = false

  do {
    const { data } = await graphqlQuery({
      query: fetchCollectionByHandleQuery,
      variables: { handle, lastProductCursor }
    })

    if (!data.collectionByHandle) {
      return null
    }

    hasNextPage = data.collectionByHandle.products.pageInfo.hasNextPage
    if (hasNextPage) {
      lastProductCursor =
        data.collectionByHandle.products.edges[data.collectionByHandle.products.edges.length - 1].cursor
    }
    collectionProducts = [...collectionProducts, ...data.collectionByHandle.products.edges]

    if (!collection) {
      collection = data.collectionByHandle
    }
  } while (hasNextPage)

  if (collection) {
    const globalSettings = await fetchGlobalSettings()

    collection.products.edges = collectionProducts

    collection = mapCollection(collection, globalSettings)

    // console.log("!@#%", collection.products[6]);

    const productsWithRelated = await Promise.all(
      collection.products.map(async (product) => {
        const TITLE_SEPARATOR = ' - '
        const query = `title:'${product.title} - '* `

        const relatedProducts = await fetchProducts({ query })

        const relatedProductsWithoutSets = relatedProducts.filter(
          (p) => p.originalTitle.split(TITLE_SEPARATOR)[0] === product.title
        )

        return {
          ...product,
          relatedProducts: relatedProductsWithoutSets
        }
      })
    )

    collection.products = productsWithRelated

    return collection
  } else {
    return null
  }
}

async function fetchCollection(handle) {
  return await fetchCollectionByHandle(handle)
  // return collection ? mapCollection(collection) : null
}

export function filterCollection(fullCollection, options) {
  // console.log('\x1b[36m%s\x1b[0m', `fetchCollection start ${handle}`)

  let collection = fullCollection

  if (!collection) {
    throw new Error('can not fetch collection with that handle')
  }

  const filteredCollection = filterCollectionFunction(collection, options)

  // Pagination

  const ITEMS_PER_PAGE = 200

  let maxPages = Math.ceil(filteredCollection.collection.products.length / ITEMS_PER_PAGE)
  let page = parseInt(options.page) || 1
  if (page < 1) {
    page = 1
  }
  if (page > maxPages) {
    page = maxPages
  }

  return {
    filters: filteredCollection.filters,
    initialActiveFilters: options.filters ?? [],
    collection: {
      ...filteredCollection.collection,
      products: filteredCollection.collection.products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
    },
    pagination: {
      current: page,
      max: maxPages
    },
    numberOfItems: filteredCollection.collection.products.length
  }
}

export default fetchCollection
