import React, { useEffect, useState } from 'react'
import useCart from '@/data/shopify/useCart'
import useCartModifier from '@/data/shopify/useCartModifier'

import { mq, theme } from '@theme'
import styled from '@emotion/styled'

import LineItemSingle from '@/components/Cart/LineItemSingle'
import LineItemBundle from '@/components/Cart/LineItemBundle'
import mapLineItemsToBundles from '@/helpers/mapLineItemsToBundles'
import formatPrice from '@/helpers/formatPrice'
import { ButtonPrimary } from '@button'
import Link from '@/components/Link'

const Root = styled.div`
  ${theme.size.menuBarHeight('padding-top')}
  ${theme.size.containerMargin('margin-left')}
  ${theme.size.containerMargin('margin-right')}
  min-height: 100vh;
  display: grid;
  ${theme.size.m('grid-column-gap')}
  ${mq['lg']} {
    grid-template-columns: 1fr 320px;
  }
`
const Side = styled.div`
  position: sticky;
  bottom: 0;
  ${theme.size.s('padding-top')}
  ${theme.size.s('padding-bottom')}
  background: white;
  align-self: end;
  ${mq['lg']} {
    align-self: auto;
    padding: 0;
    position: relative;
  }
`
const Sticky = styled.div`
  display: grid;
  align-content: start;

  ${mq['lg']} {
    position: sticky;
    ${theme.size.menuBarHeight('top')}
    ${theme.size.m('padding-top')}
  }
`
const Header = styled.div`
  ${theme.size.m('padding-top')}
  ${theme.size.m('padding-bottom')}
  ${theme.font.caps04}
`
const Subtitle = styled.div`
  margin-top: 1em;
  ${theme.font.caps07}
  a {
    text-decoration: underline;
  }
`
const Ledger = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${theme.font.caps06}
  ${theme.size.s('margin-bottom')}
`
const EmptyBag = styled.div`
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  ${theme.font.body02}
`

const ProductGrid = styled.div`
  display: grid;
  ${theme.size.s('grid-gap')}
`

const Body = styled.div``
const CartPage = () => {
  const cart = useCart()

  const cartModifier = useCartModifier()
  const [lineItems, setLineItems] = useState([])

  // console.log(cart ? cart : null)

  useEffect(() => {
    if (cart && cart.lineItems.length > 0) {
      setLineItems(mapLineItemsToBundles(cart.lineItems))
    }
    if (cart === null) {
      setLineItems([])
    }
  }, [cart])

  let itemsInBag = 0

  if (cart && cart.lineItems.length > 0) {
    cart.lineItems.forEach((i) => {
      itemsInBag = itemsInBag + i.quantity
    })
  }

  return cart === null ? (
    <EmptyBag>Your bag is empty.</EmptyBag>
  ) : (
    <Root>
      <div>
        <Header>
          Your Bag
          {/*{cart && (*/}
          {/*  <>*/}
          {/*    {itemsInBag > 0*/}
          {/*      ? itemsInBag > 1*/}
          {/*        ? itemsInBag + ' items added to bag'*/}
          {/*        : 'item added to bag'*/}
          {/*      : 'Your bag'}*/}
          {/*  </>*/}
          {/*)}*/}
          <Subtitle>
            Not quite ready to check out? <Link href={'/'}>Continue shopping</Link>.
          </Subtitle>
        </Header>

        <Body>
          {lineItems.length > 0 && (
            <ProductGrid>
              {lineItems.map((lineItem, i) => {
                if (lineItem.bundle_ref) {
                  return (
                    <LineItemBundle
                      isBig
                      key={lineItem.bundle_ref + i}
                      {...lineItem}
                      hasBottomBorder={i < lineItems.length - 1}
                    />
                  )
                } else {
                  return (
                    <LineItemSingle
                      isBig
                      key={lineItem.variant.id + i}
                      lineItem={lineItem}
                      hasBottomBorder={i < lineItems.length - 1}
                    />
                  )
                }
              })}
            </ProductGrid>
          )}
        </Body>
      </div>
      <Side>
        {cart && (
          <Sticky>
            <Ledger>
              <div>Estimated total</div>
              <div>{formatPrice(cart.subtotalPrice)}</div>
            </Ledger>
            <ButtonPrimary
              disabled={cartModifier && cartModifier.isProcessing}
              href={cart.checkoutUrl && cart.checkoutUrl.replace('splits-59.myshopify.com', 'shop.splits59.com')}
            >
              Checkout
            </ButtonPrimary>
          </Sticky>
        )}
      </Side>
    </Root>
  )
}

export default CartPage
