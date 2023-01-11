import React, { useState } from 'react'
import Link from 'next/link'

import { theme } from '@theme'
import styled from '@emotion/styled'
import SwtachDot from '@/components/SwatchDot'

const Root = styled.div``

const Title = styled.h3`
  ${theme.font.lightCaps01}
  ${theme.size.xs('margin-bottom')}
`
const ColorOption = styled.a`
  display: inline-flex;
  border: 1px solid transparent;
  padding: 0 4px;
  &:focus {
    outline: none;
  }
  &:focus-visible > div {
    ${theme.utils.focusVisible}
  }
`

const Wrap = styled.div`
  margin-left: -4px;
`

const ColorSwitcher = ({ product, productColors, isInQuickBuy }) => {
  const [currentColor, setCurrentColor] = useState(product.color)

  return (
    <Root>
      <Title>{currentColor && <div>Color: {currentColor}</div>}</Title>
      <Wrap>
        {currentColor &&
          product.relatedProducts.map((relatedProduct, i) => {
            let _color = relatedProduct.color
            if (!_color) {
              return null
            }
            return (
              <Link key={i} href={`/products/${relatedProduct.handle}`} passHref scroll={isInQuickBuy}>
                <ColorOption
                  color={_color}
                  onFocus={() => setCurrentColor(_color)}
                  onBlur={() => setCurrentColor(product.color)}
                  onMouseEnter={() => setCurrentColor(_color)}
                  onMouseLeave={() => setCurrentColor(product.color)}
                >
                  <div className="sr-only">Go to product: {_color}</div>
                  <SwtachDot
                    swatchName={_color}
                    swatchMap={productColors}
                    isCurrent={currentColor === _color}
                    isSelected={_color === product.color}
                  />
                </ColorOption>
              </Link>
            )
          })}
      </Wrap>
    </Root>
  )
}

export default ColorSwitcher
