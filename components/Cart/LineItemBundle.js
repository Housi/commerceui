import React, { useState, useEffect } from 'react'
import useCart from '@/data/shopify/useCart'
import useCartModifier from '@/data/shopify/useCartModifier'

import { ButtonUnderline, ButtonBlock } from '@button'
import Image from '@image'
import Link from 'next/link'

import { theme, mq } from '@theme'
import styled from '@emotion/styled'
import IconPlus from '../_icons/IconPlus'
import IconMinus from '../_icons/IconMinus'
import { Price } from '../LineItemPrice'
import { ButtonRaw } from '@button'
import { useAnalytics } from '@/hooks/Analytics'

const Root = styled.div`
  display: grid;
  grid-gap: 20px;
  ${(p) =>
    p.hasBottomBorder
      ? `
  ${theme.size.s('padding-bottom')}
  border-bottom: 1px solid ${theme.colors.mono100}
  `
      : ``}
`
const Title = styled.div`
  display: flex;
  justify-content: space-between;
  s {
    color: ${theme.colors.mono500};
  }
  line-height: 1.5;
  ${theme.font.caps07}
  ${(p) =>
    p.isBig
      ? `${mq['md']} {
    ${theme.font.caps06}
  }`
      : ``}
`

const ExtraInfoBox = styled.div`
  ${theme.font.body03}
  span {
    color: ${theme.colors.red};
  }
`

const LineItemInfo = styled.div`
  ${theme.font.body02}
  line-height: 1.5;
`

const QtyPicker = styled.div`
  margin-right: 8px;
  display: inline-grid;
  height: 24px;
  grid-template-columns: 24px 14px 24px;
  align-items: center;
  text-align: center;
  transition: all 100ms;
  ${theme.font.body02}
  ${(props) => (props.disabled ? `opacity: 0.5; pointer-events: none;` : '')}
${theme.font.body02}
svg {
    width: 10px;
    height: 10px;
  }
`

const Utils = styled.div`
  ${theme.font.body02}
  display: flex;
`

const Pieces = styled.div`
  display: grid;
  grid-gap: 20px;
  border-left: 2px solid black;
  padding-left: 20px;
`
const PiecesItem = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 90px 1fr;
  ${mq['lg']} {
    ${(p) => (p.isBig ? 'grid-template-columns: 140px 1fr;' : '')}
  }
`

const PriceWrap = styled.div`
  white-space: nowrap;
  margin-left: 8px;
`

const ButtonInner = styled.div`
  ${(props) => (props.disabled ? 'opacity: 0.5;' : '')}
`

const LineItemBundle = ({ title, pieces, bundle_ref, discountTitle, isBig, hasBottomBorder }) => {
  const quantity = pieces[0].quantity

  const [bundlePrice, setBundlePrice] = useState({
    price: 0,
    compareAtPrice: null
  })

  const cartModifier = useCartModifier()
  const cart = useCart()
  const Analytics = useAnalytics()

  const calculatePrice = (pieces) => {
    let price = 0
    let compareAtPrice = null

    pieces.forEach((piece) => {
      let piecePrice = piece.variant.priceV2
        ? parseFloat(piece.variant.priceV2.amount)
        : parseFloat(piece.variant.price.amount)
      let unitDiscount = null
      if (piece.discountAllocations && piece.discountAllocations.length > 0) {
        unitDiscount = parseFloat(piece.discountAllocations[0]?.allocatedAmount?.amount ?? null) / quantity
      }
      if (unitDiscount) {
        price = price + quantity * (piecePrice - unitDiscount)
        compareAtPrice = compareAtPrice + quantity * piecePrice
      } else {
        price = price + quantity * piecePrice
      }
    })

    return {
      price,
      compareAtPrice
    }
  }
  useEffect(() => {
    if (!(cartModifier && cartModifier.isProcessing)) {
      setBundlePrice(calculatePrice(pieces))
    }
  }, [pieces])

  const removeBundle = () => {
    let newLineItems = cart.lineItems.filter(
      (item) => item.customAttributes.find((a) => a.key === '_set_handle')?.value !== bundle_ref
    )

    cartModifier.replace(newLineItems).then((response) => {
      Analytics.removeFromCart(
        pieces.map((bundlePiece) => bundlePiece.variant),
        quantity
      )
    })
  }

  const modifyBundleQuantity = (diff) => {
    let newLineItems = [...cart.lineItems]

    newLineItems = newLineItems.map((item) => {
      if (item.customAttributes.find((a) => a.key === '_set_handle')?.value === bundle_ref) {
        let newItem = {
          id: item.id,
          variant: item.variant,
          customAttributes: item.customAttributes,
          quantity: item.quantity + diff,
          product: item.product,
          discountAllocations: item.discountAllocations ?? null
        }
        return newItem
      } else {
        return item
      }
    })

    cartModifier.replace(newLineItems).then((response) => {
      // console.log("modifyBundleQuantity response", response);
      // setBundlePrice(calculatePrice(pieces))

      // console.log("addToBagSelectedProductVariants response", response)
      if (response.isPartiallyUpdated) {
        alert(
          "We're sorry, but unfortunately we can't add this product to the bag. It was either just bought by another customer or you already have maximum available quantity in the bag."
        )
      } else {
        if (diff > 0) {
          Analytics.addToBag(
            pieces.map((p) => p.variant),
            quantity
          )
        } else if (diff < 0) {
          Analytics.removeFromCart(
            pieces.map((p) => p.variant),
            quantity
          )
        }
      }
    })
  }

  let increaseBundleQuantityDisabled = quantity === Math.min(...pieces.map((p) => p.variant.quantityAvailable))

  return (
    <Root hasBottomBorder={hasBottomBorder}>
      <div>
        <Title isBig={isBig}>
          {title}
          <PriceWrap disabled={cartModifier && cartModifier.isProcessing}>
            <Price price={bundlePrice.price} compareAtPrice={bundlePrice.compareAtPrice} quantity={1} />
          </PriceWrap>
        </Title>

        <ExtraInfoBox>{discountTitle && <span>{discountTitle}</span>}</ExtraInfoBox>
      </div>

      <Pieces>
        <Utils>
          <QtyPicker disabled={cartModifier && cartModifier.isProcessing}>
            <ButtonBlock onClick={() => modifyBundleQuantity(-1)}>
              <IconMinus />
            </ButtonBlock>
            <div>{quantity}</div>
            <ButtonBlock onClick={() => modifyBundleQuantity(1)} disabled={increaseBundleQuantityDisabled}>
              <ButtonInner disabled={increaseBundleQuantityDisabled}>
                <IconPlus />
              </ButtonInner>
            </ButtonBlock>
          </QtyPicker>
          <div>
            <ButtonUnderline onClick={removeBundle}>Remove set</ButtonUnderline>
          </div>
        </Utils>

        {pieces.map((piece) => {
          return (
            <PiecesItem key={bundle_ref + piece.variant.sku} isBig={isBig}>
              <div>
                {piece.variant.product.primaryImage && (
                  <Link href={'/products/' + piece.variant.product.handle}>
                    <a tabIndex={-1}>
                      <Image image={piece.variant.product.primaryImage} sizes={isBig ? '140px' : '100px'} />
                    </a>
                  </Link>
                )}
              </div>
              <div>
                <Title isBig={isBig}>
                  <ButtonRaw href={'/products/' + piece.variant.product.handle}>
                    {piece.variant.product.title}
                  </ButtonRaw>
                </Title>

                <LineItemInfo>
                  {piece.variant.selectedOptions.map((o, i) => {
                    return (
                      <div key={i}>
                        {o.name}: {o.value}
                      </div>
                    )
                  })}
                </LineItemInfo>
              </div>
            </PiecesItem>
          )
        })}
      </Pieces>
    </Root>
  )
}

export default LineItemBundle
