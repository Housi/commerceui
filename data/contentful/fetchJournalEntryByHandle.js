import fetchContentfulGraphQL from '@/data/contentful/fetchContentfulGraphQL'
import AssetFragment from '@/data/contentful/fragments/AssetFragment'
import fetchProductsByVariantIds from '@/data/shopify/fetchProductsByVariantIds'
import {
  SectionImageImageFragment,
  SectionImageTextFragment,
  SectionTextImageFragment,
  SectionPanoramicImageFragment,
  SectionJournalTextFragment
} from '@/data/contentful/fragments/sectionFragments'
import SectionTextFragment from '@/data/contentful/fragments/SectionTextFragment'

function extractGlobalSettings(response) {
  return response?.data?.journalEntryCollection?.items?.[0] ?? null
}

async function fetchJournalEntryByHandle(handle, preview) {
  const response = await fetchContentfulGraphQL(
    `
    ${AssetFragment}
    ${SectionImageImageFragment}
    ${SectionImageTextFragment}
    ${SectionTextImageFragment}
    ${SectionTextFragment}
    ${SectionPanoramicImageFragment}
    ${SectionJournalTextFragment}
    query {
      journalEntryCollection(where: { slug: "${handle}"}, limit: 1, preview: ${preview ? 'true' : 'false'}) {
        items {
          title
          lead
          slug
          image {
            ...AssetFragment
          }
          imageMobile {
            ...AssetFragment
          }
          sectionsCollection (limit:20) {
            items {
              __typename
              ...SectionImageImageFragment
              ...SectionImageTextFragment
              ...SectionTextImageFragment
              ...SectionTextFragment
              ...SectionPanoramicImageFragment
              ...SectionJournalTextFragment
            }
          }
          relatedProducts
        }
      }
    }
    `,
    preview
  )

  const entry = extractGlobalSettings(response)

  if (!entry) {
    return null
  }

  if (entry.relatedProducts && entry.relatedProducts.length > 0) {
    entry.relatedProducts = await fetchProductsByVariantIds(entry.relatedProducts)
  }

  entry.sections = entry.sectionsCollection.items

  return entry
}

export default fetchJournalEntryByHandle
