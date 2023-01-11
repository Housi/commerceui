import fetchContentfulGraphQL from './fetchContentfulGraphQL'
import AssetFragment from './fragments/AssetFragment'
import fetchProductsByVariantIds from '../shopify/fetchProductsByVariantIds'
import {
  SectionImageImageFragment,
  SectionImageTextFragment,
  SectionTextImageFragment
} from '@/data/contentful/fragments/sectionFragments'

function extractGlobalSettings(response) {
  return response?.data?.fabricPageCollection?.items?.[0] ?? null
}

async function fetchFabricPageByHandle(handle, preview) {
  const response = await fetchContentfulGraphQL(
    `
    ${AssetFragment}
    ${SectionImageTextFragment}
    ${SectionImageImageFragment}
    ${SectionTextImageFragment}
    query {
      fabricPageCollection(where: { slug: "${handle}"}, limit: 1, preview: ${preview ? 'true' : 'false'}) {
        items {
          name
          slug
          seoTitle
          seoDescription
          image {
            ...AssetFragment
          }
          imageMobile {
            ...AssetFragment
          }
          sectionsCollection (limit:20) {
            items {
              __typename
              ...SectionTextImageFragment
              ...SectionImageTextFragment
              ...SectionImageImageFragment
            }
          }
          products

        }
      }
    }
    `,
    preview
  )

  const fabric = extractGlobalSettings(response)

  if (!fabric) {
    return null
  }

  if (fabric.products && fabric.products.length > 0) {
    fabric.products = await fetchProductsByVariantIds(fabric.products)
  }

  return fabric
}

export default fetchFabricPageByHandle
