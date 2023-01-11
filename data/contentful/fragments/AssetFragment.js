const AssetFragment = `
fragment AssetFragment on Asset {
  title
  description
  contentType
  fileName
  size
  src: url
  width
  height
}`
export default AssetFragment