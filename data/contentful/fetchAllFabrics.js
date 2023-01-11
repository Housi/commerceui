import fetchContentfulGraphQL from "./fetchContentfulGraphQL"
import AssetFragment from "./fragments/AssetFragment";

function extractGlobalSettings(response) {
  return response?.data?.fabricPageCollection?.items ?? null
}

async function fetchAllFabrics() {
  const response = await fetchContentfulGraphQL(
    `
    ${AssetFragment}
    query {
      fabricPageCollection(limit: 50, order: name_ASC) {
        items {
          slug
          name
          imageMobile {
            ...AssetFragment
          }
        }
      }
    }
    `);

  return extractGlobalSettings(response)
}

export default fetchAllFabrics