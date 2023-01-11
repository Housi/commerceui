import React, { useState, useEffect } from 'react'
import useCart from '@/data/shopify/useCart'
import styled from '@emotion/styled'
import { useUI } from '@/hooks/UI'

import { theme, mq, lin } from '@theme'

import Container from '@/components/Container'
import { ButtonLogo, ButtonBlock } from '@button'
import IconBurger from '@/components/_icons/IconBurger'
import IconBag from '@/components/_icons/IconBag'
import IconAccount from '@/components/_icons/IconAccount'
import SearchButton from '@/components/NavBar/SearchButton'
import { useRouter } from 'next/router'
import { useCustomer } from '@/hooks/Customer'

const Root = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  transition: all 300ms;
  mix-blend-mode: difference;
  color: white;
`

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: -8px;
  margin-right: -8px;
  ${theme.size.menuBarHeight('height')}
  svg {
    fill: currentColor;
  }
`

const Group = styled.div`
  display: inline-grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  pointer-events: all;
  align-items: center;
  ${lin('grid-column-gap', 4, 20)}
  .fixed-width {
    width: 36px;
  }
`
const ButtonInner = styled.div`
  white-space: nowrap;
  ${theme.font.caps06}
  line-height: 1;
  transition: all 200ms;
  position: relative;
  height: 32px;
  display: flex;
  align-items: center;
  padding: 0 4px;
`
const HideOnMobile = styled.div`
  display: none;
  ${mq['lg']} {
    display: inline-flex;
  }
`
const HideOnDesktop = styled.div`
  display: inline-flex;
  ${mq['lg']} {
    display: none;
  }
`
const Micro = styled.span`
  ${theme.font.body03}
  position: absolute;
  top: 0;
  right: 0;
`

// CART BUTTON

const CartButton = ({ onClick }) => {
  const cart = useCart()

  let itemsInBag = 0
  if (cart && cart.lineItems.length > 0) {
    cart.lineItems.forEach((i) => {
      itemsInBag = itemsInBag + i.quantity
    })
  }

  return (
    <ButtonBlock onClick={onClick}>
      <ButtonInner>
        <HideOnDesktop>
          <IconBag />
          {cart && <Micro>{itemsInBag}</Micro>}
        </HideOnDesktop>
        <HideOnMobile>BAG {cart && `(${itemsInBag})`}</HideOnMobile>
      </ButtonInner>
    </ButtonBlock>
  )
}

const NavBar = () => {
  const { openNav, openCart } = useUI()
  const [isLaVisible, setLaVisible] = useState(true)
  const [isFirstLoad, setFirstLoad] = useState(true)

  const router = useRouter()

  useEffect(() => {
    if (isFirstLoad && router.pathname !== '/') {
      setLaVisible(false)
      setFirstLoad(false)
    }

    const handleRouteComplete = (url) => {
      if (isLaVisible) {
        if (url !== '/') {
          setLaVisible(false)
        }
      } else {
        if (url === '/') {
          setLaVisible(true)
        }
      }
    }
    router.events.on('routeChangeComplete', handleRouteComplete)
    return () => {
      router.events.off('routeChangeComplete', handleRouteComplete)
    }
  })

  const Customer = useCustomer()

  const firstName = Customer?.CustomerFirstName

  return (
    <Root>
      <Container isWide>
        <Inner>
          <Group>
            <ButtonBlock onClick={openNav}>
              <ButtonInner>
                <IconBurger />
                <HideOnMobile className={'fixed-width'}>Shop</HideOnMobile>
              </ButtonInner>
            </ButtonBlock>
            <ButtonLogo href={'/'} isLaVisible={isLaVisible} />
          </Group>

          <Group>
            <SearchButton />

            <ButtonBlock href={'https://shop.splits59.com/account'}>
              <ButtonInner>
                <HideOnDesktop>
                  <IconAccount />
                </HideOnDesktop>
                <HideOnMobile>{firstName ? `Hi, ${firstName}` : 'Account'}</HideOnMobile>
              </ButtonInner>
            </ButtonBlock>
            <CartButton onClick={openCart} />
          </Group>
        </Inner>
      </Container>
    </Root>
  )
}

export default NavBar
