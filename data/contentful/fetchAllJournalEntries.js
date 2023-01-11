import fetchContentfulGraphQL from './fetchContentfulGraphQL'
import AssetFragment from '@/data/contentful/fragments/AssetFragment'

function extract(response) {
  return response?.data?.journalEntryCollection?.items ?? null
}

async function fetchAllJournalEntries() {
  const response = await fetchContentfulGraphQL(`
  ${AssetFragment}
  query journalEntryCollectionQuery {
    journalEntryCollection {
      items {
        sys {
          id
        }
        title
        slug
        lead
        image {
          ...AssetFragment
        }
        imageMobile {
          ...AssetFragment
        }
        imageCard {
          ...AssetFragment
        }
        imageCardMobile {
          ...AssetFragment
        }
      }
    }
  }
`)

  return extract(response)
}

export default fetchAllJournalEntries
