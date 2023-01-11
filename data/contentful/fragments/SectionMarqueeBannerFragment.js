const SectionMarqueeBannerFragment = `
fragment SectionMarqueeBannerFragment on SectionMarqueeBanner {
  sys{
    id
  }
  buttonHref
  buttonLabel
  movingText
  isContentWhite: contentColor
  image {
    ...AssetFragment
  }
  imageMobile {
    ...AssetFragment
  }
}`

export default SectionMarqueeBannerFragment