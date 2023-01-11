import fetchContentfulGraphQL from "./fetchContentfulGraphQL"
import AssetFragment from "./fragments/AssetFragment";
import SectionPortraitImagesFragment from "./fragments/SectionPortraitImagesFragment";
import SectionMarqueeBannerFragment from "./fragments/SectionMarqueeBannerFragment";
import SectionSvgBannerFragment from "./fragments/SectionSvgBannerFragment";

function extractHome(response) {
  return response?.data?.homePageCollection?.items[0] ?? null
}

const productionQuery = (id) =>{
  let collectionQueryParams;
  if(id) {
    collectionQueryParams = `where: {sys:{id: "${id}"}}, limit: 1, preview: true`
  } else {
    collectionQueryParams = 'limit: 1'
  }
  return `
${AssetFragment}
${SectionMarqueeBannerFragment}
${SectionSvgBannerFragment}
${SectionPortraitImagesFragment}
query {
  homePageCollection (${collectionQueryParams}) {
    items {
      sys {
        id
      }
      name
      columnGap
      columnGapMobile
      rowGap
      rowGapMobile
      sectionsCollection (limit: 20) {
        items {
          __typename
          ...SectionMarqueeBannerFragment
          ...SectionPortraitImagesFragment
          ...SectionSvgBannerFragment
          ...on SectionNewsletterForm {
            title
          }
          ...on Section5050 {
            firstBanner {
              ...SectionSvgBannerFragment
            }
            isFirstBannerHiddenOnMobile
            secondBanner {
              ...SectionSvgBannerFragment
            }
            isSecondBannerHiddenOnMobile
          }
        }
      }
    }
  }
}
`
}

async function fetchHome(id) {

  const response = await fetchContentfulGraphQL(productionQuery(id), !!id);

  return extractHome(response)

}

export default fetchHome