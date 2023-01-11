const mapLineItemsToBundles = (lineItems) => {
  let _handledBundleRefs = []
  let newLineItems = []

  lineItems.forEach((lineItem) => {
    const bundle_ref = lineItem.customAttributes?.find((a) => a.key === '_set_handle')?.value
    if (bundle_ref) {
      if (!_handledBundleRefs.includes(bundle_ref)) {
        let isCurrentBundlePiece = (item) =>
          item.customAttributes?.find((a) => a.key === '_set_handle')?.value === bundle_ref
        const bundle = {
          bundle_ref: bundle_ref,
          title: lineItem.customAttributes.find((a) => a.key === '_set_title').value,
          pieces: lineItems.filter(isCurrentBundlePiece),
          discountTitle:
            lineItem.discountAllocations?.length > 0 && lineItem.discountAllocations[0]
              ? lineItem.discountAllocations[0].discountApplication.title
              : null
        }
        _handledBundleRefs.push(bundle_ref)
        newLineItems.push(bundle)
      }
    } else {
      newLineItems.push(lineItem)
    }
  })

  return newLineItems
}

export default mapLineItemsToBundles
