import React from 'react'
import styled from '@emotion/styled'
import { rs, theme } from '@theme'
import Container from '@/components/Container'
import ProductCard from '@/components/ProductCard'
import { AnalyticsListItemProvider } from '@/hooks/Analytics'

const Root = styled.div`
  position: relative;
  display: grid;
  ${theme.size.gutter('grid-gap')}
  ${(props) => (props.gridColumns === 3 ? rs('grid-template-columns', ['repeat(2, 1fr)', null, 'repeat(3, 1fr)']) : '')}
  ${(props) => (props.gridColumns === 2 ? rs('grid-template-columns', ['repeat(2, 1fr)', null, 'repeat(2, 1fr)']) : '')}
`
const Title = styled.h2`
  ${theme.font.caps04}
  ${theme.size.m('margin-bottom')}
`
const ProductGrid = ({
  children,
  collectionHandle,
  columns = 3,
  title,
  products,
  analyticsListName = 'product-grid'
}) => {
  return (
    <Container>
      {title && <Title dangerouslySetInnerHTML={{ __html: title }} />}
      <Root gridColumns={columns}>
        {products && products.length > 0
          ? products.map((product, i) => (
              <AnalyticsListItemProvider key={product.id} list={analyticsListName} position={i + 1}>
                <ProductCard
                  product={product}
                  isHalfOnDesktop={columns === 2}
                  preload={i < 3}
                  collectionHandle={collectionHandle}
                />
              </AnalyticsListItemProvider>
            ))
          : children}
      </Root>
    </Container>
  )
}

export default ProductGrid
