import fetchContentfulGraphQL from "./fetchContentfulGraphQL"
import AssetFragment from "./fragments/AssetFragment";
import SectionSvgBannerFragment from "./fragments/SectionSvgBannerFragment";
import SectionPortraitImagesFragment from "./fragments/SectionPortraitImagesFragment";

function extract(response) {
  return response?.data?.editorialCollectionCollection?.items?.[0] ?? null
}
const query = (handle, preview) => `
${AssetFragment}
${SectionSvgBannerFragment}
${SectionPortraitImagesFragment}
query editorialCollectionEntryQuery {
  editorialCollectionCollection(where: {slug:"${handle}"}, limit: 1, preview: ${preview}) {
    items {
      slug
      rowsCollection (limit: 20) {
        items {
          __typename
          ...SectionSvgBannerFragment
          ...SectionPortraitImagesFragment
          ...on SectionMarqueeText {
            text
          }
          ...on SectionText {
            title
            paragraph
          }
          ...on Slots {
            slots
          }
        }
      }
    }
  }
}
`;

async function fetchEditorialCollectionByHandle(handle, preview) {
  const response = await fetchContentfulGraphQL(query(handle, preview), preview);
  return extract(response)
}

export default fetchEditorialCollectionByHandle