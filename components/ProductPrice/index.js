import formatPrice from '../../helpers/formatPrice'
import React from 'react'

const ProductPrice = ({ price, compareAtPrice, showFromLabel }) => {
  return compareAtPrice ? (
    <>
      {formatPrice(price)} <s>&nbsp;{formatPrice(compareAtPrice)}&nbsp;</s>
    </>
  ) : (
    <>
      {showFromLabel ? 'From ' : ''}
      {formatPrice(price)}
    </>
  )
}

export default ProductPrice
