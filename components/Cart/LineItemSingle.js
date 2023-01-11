import React from 'react'
import useCart from '@/data/shopify/useCart'
import useCartModifier from '@/data/shopify/useCartModifier'

import { ButtonUnderline } from '@button'
import Image from '@image'
import Link from 'next/link'

import { theme, mq } from '@theme'
import styled from '@emotion/styled'
import IconPlus from '@/components/_icons/IconPlus'
import IconMinus from '@/components/_icons/IconMinus'
import LineItemPrice from '@/components/LineItemPrice'
import { ButtonRaw } from '@button'
import { useAnalytics } from '@/hooks/Analytics'

const Root = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 90px 1fr;
  ${mq['lg']} {
    ${(p) => (p.isBig ? 'grid-template-columns: 140px 1fr;' : '')}
  }
  ${(p) =>
    p.hasBottomBorder
      ? `
      ${theme.size.s('padding-bottom')}
    border-bottom: 1px solid ${theme.colors.mono100}

  `
      : ``}
`
const DetailsWrap = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
`
const TopBox = styled.div``
const Title = styled.div`
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  s {
    color: ${theme.colors.mono500};
  }
  ${theme.font.caps07}
  ${(p) =>
    p.isBig
      ? `
  
  ${mq['md']} {
    ${theme.font.caps06}
  }
  `
      : ``}
`
const BottomBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${theme.font.body02}
`

const LineItemInfo = styled.div`
  ${theme.font.body02}
  line-height: 1.5;
  .preorder {
    color: ${theme.colors.mono700};
  }
`

const QtyPicker = styled.div`
  height: 24px;
  align-items: center;
  display: inline-grid;
  grid-template-columns: 24px 14px 24px;
  text-align: center;
  transition: all 100ms;
  ${(props) => (props.disabled ? `opacity: 0.5; pointer-events: none;` : '')}
  ${theme.font.body02}
svg {
    width: 10px;
    height: 10px;
  }
`

const ButtonInner = styled.div`
  ${(props) => (props.disabled ? 'opacity: 0.5;' : '')}
`

const LineItemSingle = ({ lineItem, isBig, hasBottomBorder }) => {
  const cartModifier = useCartModifier()
  const cart = useCart()

  const Analytics = useAnalytics()

  const modifyQuantity = (diff) => {
    let variant

    let newLineItems = cart.lineItems.map((item) => {
      if (item.variant.id === lineItem.variant.id && !item.customAttributes?.find((a) => a.key === '_set_handle')) {
        // console.log('found the same variant, change quantity')

        variant = lineItem.variant

        return {
          id: lineItem.id,
          variant: lineItem.variant,
          quantity: lineItem.quantity + diff
        }
      } else {
        return item
      }
    })

    // console.log("modifyQuantity lineItems",newLineItems)

    cartModifier.replace(newLineItems).then((response) => {
      if (diff > 0) Analytics.addToCart([lineItem.variant])
      if (diff < 0) Analytics.removeFromCart([lineItem.variant])
      // console.log("modifyQuantity response", response);
      //
      // if (diff > 0) {
      //   Analytics.addToBag([variant], diff)
      // }
      // else if (diff < 0) {
      //   Analytics.removeFromBag([variant], -diff)
      // }
    })
  }

  const isQtyDisabled = cartModifier && cartModifier.isProcessing

  return (
    <>
      <Root isBig={isBig} hasBottomBorder={hasBottomBorder}>
        <div>
          {lineItem.variant.product.primaryImage && (
            <Link href={'/products/' + lineItem.variant.product.handle}>
              <a tabIndex={-1}>
                <Image image={lineItem.variant.product.primaryImage} sizes={isBig ? '140px' : '100px'} />
              </a>
            </Link>
          )}
        </div>
        <DetailsWrap>
          <TopBox>
            <Title isBig={isBig}>
              <ButtonRaw href={'/products/' + lineItem.variant.product.handle}>
                {lineItem.variant.product.title}
              </ButtonRaw>
              <div>
                <LineItemPrice lineItem={lineItem} />
              </div>
            </Title>

            <LineItemInfo>
              {lineItem.variant.selectedOptions.map((o, i) => {
                return (
                  <div key={i}>
                    {o.name}: {o.value}
                  </div>
                )
              })}
              {lineItem.customAttributes?.find((a) => a.key === 'ships_on') && (
                <div className={'preorder'}>{lineItem.customAttributes.find((a) => a.key === 'ships_on').value}</div>
              )}
            </LineItemInfo>

            <QtyPicker disabled={cartModifier && cartModifier.isProcessing}>
              <ButtonRaw onClick={() => modifyQuantity(-1)}>
                <IconMinus />
              </ButtonRaw>
              <div>{lineItem.quantity}</div>
              <ButtonRaw
                disabled={lineItem.quantity === lineItem.variant.quantityAvailable}
                onClick={() => modifyQuantity(1)}
              >
                <ButtonInner disabled={lineItem.quantity === lineItem.variant.quantityAvailable}>
                  <IconPlus />
                </ButtonInner>
              </ButtonRaw>
            </QtyPicker>
          </TopBox>
          <BottomBox>
            <ButtonUnderline
              onClick={() => {
                cartModifier.remove(lineItem.id)
                Analytics.removeFromCart([lineItem.variant], lineItem.quantity)
              }}
            >
              Remove
            </ButtonUnderline>
          </BottomBox>
        </DetailsWrap>
      </Root>
    </>
  )
}

export default LineItemSingle
