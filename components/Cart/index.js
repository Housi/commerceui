import React, { useEffect, useState } from 'react'
import useCart from '@/data/shopify/useCart'
import useCartModifier from '@/data/shopify/useCartModifier'

import styled from '@emotion/styled'

import { useUI } from '@/hooks/UI'

import { ButtonPrimary, ButtonSecondary } from '@button'
import Modal from '@/components/Modal'
import LineItemSingle from '@/components/Cart/LineItemSingle'
import LineItemBundle from '@/components/Cart/LineItemBundle'

import formatPrice from '@/helpers/formatPrice'
import mapLineItemsToBundles from '@/helpers/mapLineItemsToBundles'

import { theme } from '@theme'
import { FitLoader } from '@/components/PageLoader'
import { keyframes } from '@emotion/react'

const dotsAnim = keyframes`
  0% {
    content: ".";
  }
  25% {
    content: "..";
  }
  50% {
    content: "...";
  }
  75% {
    content: "";
  }
`
const LedgerRowRoot = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${theme.font.caps06}
  transition: opacity 200ms;
  .price {
    transition: opacity 100ms;
  }
  ${(p) => (p.isLoading ? `.price { opacity: 0.3; }  ` : ``)}
`
const LedgerRow = ({ label, value, isLoading }) => {
  return (
    <LedgerRowRoot isLoading={isLoading}>
      <div>{label}</div>
      <div className={'price'}>{value}</div>
    </LedgerRowRoot>
  )
}

const EmptyBag = styled.div`
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  position: absolute;
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

const Body = styled.div`
  overflow-y: auto;
  position: relative;
  height: 100%;
  ${theme.size.s('padding')}
`
const Footer = styled.div`
  display: grid;
  border-top: 1px solid ${theme.colors.mono100};
  ${theme.size.s('padding')}
  ${theme.size.xs('grid-gap')}
`

const Cart = () => {
  const cart = useCart()

  const { isCartOpen, closeCart } = useUI()
  const [lineItems, setLineItems] = useState([])

  const cartModifier = useCartModifier()

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

  const footer = cart && (
    <Footer>
      <LedgerRow
        label={`Estimated total`}
        value={formatPrice(cart.subtotalPrice)}
        isTotal
        isLoading={cartModifier && cartModifier.isAnyModifierProcessing}
      />
      <ButtonSecondary href={'/bag'}>View Bag</ButtonSecondary>

      <ButtonPrimary
        href={cart.checkoutUrl && cart.checkoutUrl.replace('splits-59.myshopify.com', 'shop.splits59.com')}
        // disabled={cartModifier?.isAnyModifierProcessing}
      >
        Checkout
      </ButtonPrimary>
    </Footer>
  )

  return (
    <Modal
      isOpen={isCartOpen}
      onRequestClose={closeCart}
      title={
        cart === undefined
          ? 'Bag'
          : itemsInBag > 0
          ? itemsInBag > 1
            ? itemsInBag + ' items added to bag'
            : 'One item added to bag'
          : 'Your bag'
      }
      footer={footer}
      placement={'right'}
    >
      <Body>
        {cart === undefined && <FitLoader />}

        {cart === null && <EmptyBag>Your bag is empty.</EmptyBag>}

        {cart && lineItems.length > 0 && (
          <ProductGrid>
            {lineItems.map((lineItem, i) => {
              if (lineItem.bundle_ref) {
                return <LineItemBundle key={lineItem.bundle_ref + i} {...lineItem} />
              } else {
                return <LineItemSingle key={lineItem.variant.id + i} lineItem={lineItem} />
              }
            })}
          </ProductGrid>
        )}
      </Body>
    </Modal>
  )
}

export default Cart
