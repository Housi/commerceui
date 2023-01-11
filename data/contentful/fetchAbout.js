import fetchContentfulGraphQL from './fetchContentfulGraphQL'
import AssetFragment from './fragments/AssetFragment'
import SectionTextFragment from '@/data/contentful/fragments/SectionTextFragment'
import {
  SectionImageImageFragment,
  SectionImageTextFragment,
  SectionTextImageFragment
} from '@/data/contentful/fragments/sectionFragments'

function extract(response) {
  if (response?.data?.aboutPage) {
    return {
      ...response.data.aboutPage,
      sections: response.data.aboutPage.sectionsCollection.items
    }
  } else {
    return null
  }
}

const query = `
${AssetFragment}
${SectionTextImageFragment}
${SectionImageTextFragment}
${SectionImageImageFragment}
${SectionTextFragment}
query {
  aboutPage(id: "2LPhTg9rd25BKCu8yJyyaj") {
    sys {
      id
    }
    title
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
        ...SectionTextFragment
      }
    }
  }
}
`
async function fetchAbout() {
  const response = await fetchContentfulGraphQL(query)

  return extract(response)
}

export default fetchAbout
