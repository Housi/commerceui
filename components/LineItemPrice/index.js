import formatPrice from '../../helpers/formatPrice'
import React from 'react'

const Price = ({ compareAtPrice, price, discount, quantity = 1 }) => {
  let newPrice = null
  let newCompareAtPrice = null

  if (discount) {
    newPrice = price * quantity - discount
    newCompareAtPrice = price * quantity
  } else {
    newPrice = price * quantity
    if (compareAtPrice) {
      newCompareAtPrice = compareAtPrice * quantity
    }
  }

  return newCompareAtPrice ? (
    <>
      <s>&nbsp;{formatPrice({ amount: newCompareAtPrice })}&nbsp;</s> {formatPrice({ amount: newPrice })}
    </>
  ) : (
    <>{formatPrice({ amount: newPrice })}</>
  )
}

const LineItemPrice = ({ lineItem }) => {
  const quantity = parseFloat(lineItem.quantity)
  const basePrice = lineItem.variant.priceV2
    ? parseFloat(lineItem.variant.priceV2.amount)
    : parseFloat(lineItem.variant.price.amount)
  const baseCompareAtPrice = lineItem.variant.compareAtPriceV2
    ? parseFloat(lineItem.variant.compareAtPriceV2.amount)
    : parseFloat(lineItem.variant.compareAtPrice?.amount)

  let discount = null

  if (lineItem.discountAllocations && lineItem.discountAllocations.length > 0) {
    discount = parseFloat(lineItem.discountAllocations[0]?.allocatedAmount?.amount ?? null)
  }

  return <Price quantity={quantity} compareAtPrice={baseCompareAtPrice} price={basePrice} discount={discount} />
}

export default LineItemPrice

export { Price }
