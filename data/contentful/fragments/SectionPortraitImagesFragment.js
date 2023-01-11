
const SectionPortraitImagesFragment = `
fragment SectionPortraitImagesFragment on SectionPortraitImages {
  title
  imagesCollection (limit: 20) {
    items  {
      ... on SectionPortraitImagesItem {
        text
        href
        image {
          ...AssetFragment
        }
      }
    }
  }
}
`
export default SectionPortraitImagesFragment