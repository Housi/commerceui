const SectionSvgBannerFragment = `
fragment SectionSvgBannerFragment on SectionSvgBanner {
  sys{
    id
  }
  background {
    ... on Video { video: file }
    ... on Image {
      image: file { ...AssetFragment }
    }
   }
  backgroundMobile {
    ... on Video { video: file }
    ... on Image {
      image: file { ...AssetFragment }
    }
  }
  contentImage {
    ...AssetFragment
  }
  contentImageMobile {
    ...AssetFragment
  }
  buttonLabel
  buttonHref
  contentColor
  contentColorMobile
  buttonTop
  buttonLeft
  buttonTopMobile
  buttonLeftMobile
  isFullBleed
}
`

export default SectionSvgBannerFragment