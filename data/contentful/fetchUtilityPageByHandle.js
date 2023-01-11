import fetchContentfulGraphQL from "./fetchContentfulGraphQL"

function extractGlobalSettings(response) {
  return response?.data?.utilityPageCollection?.items?.[0] ?? null
}

async function fetchUtilityPageByHandle(handle, preview) {
  const response = await fetchContentfulGraphQL(
    `query {
      utilityPageCollection(where: { slug: "${handle}"}, preview: ${preview ? 'true' : 'false'}, limit: 1) {
        items {
          title
          description
          slug 
          titleInSidebar
          richText {
            json
          }
          accordionCollection {
            items {
              title
              tag
              content {
                json
              }
            }
          }
        }
      }
    }
    `,
    preview
  );

  return extractGlobalSettings(response)
}

export default fetchUtilityPageByHandle