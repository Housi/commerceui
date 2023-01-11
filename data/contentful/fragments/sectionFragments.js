export const SectionImageTextFragment = `
fragment SectionImageTextFragment on SectionImageText {
  image {
    ...AssetFragment
  }
  title
  buttonLabel
  buttonHref
}
`
export const SectionTextImageFragment = `
fragment SectionTextImageFragment on SectionTextImage {
  image {
    ...AssetFragment
  }
  title
  buttonLabel
  buttonHref
}
`
export const SectionImageImageFragment = `
fragment SectionImageImageFragment on SectionImageImage {
  image {
    ...AssetFragment
  }
  image2 {
    ...AssetFragment
  }
}
`

export const SectionJournalTextFragment = `
fragment SectionJournalTextFragment on SectionJournalText {
  content {
    json
  }
}
`

export const SectionPanoramicImageFragment = `
fragment SectionPanoramicImageFragment on SectionPanoramicImage {
  title
  image {
    ...AssetFragment
  }
}
`
