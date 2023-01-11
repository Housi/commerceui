import fetchContentfulGraphQL from './fetchContentfulGraphQL'
import AssetFragment from '@/data/contentful/fragments/AssetFragment'

function extract(response) {
  return response?.data?.pressEntryCollection?.items ?? null
}

async function fetchAllPressEntries() {
  const response = await fetchContentfulGraphQL(`
  ${AssetFragment}
  query pressEntryCollectionQuery {
    pressEntryCollection {
      items {
        sys {
          id
        }
        title
        description
        link
        image {
          ...AssetFragment
        }
        logo {
          ...AssetFragment
        }
        
      }
    }
  }
`)

  return extract(response)
}

export default fetchAllPressEntries
