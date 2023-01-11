import React from 'react'

import styled from '@emotion/styled'
import { theme, mq } from '@theme'

import ProductCard from '@/components/ProductCard'
import SectionMarqueeBanner from '@/components/_sections/SectionMarqueeBanner'
import SectionPortraitImages from '@/components/_sections/SectionPortraitImages'
import SectionSvgBanner from '@/components/_sections/SectionSvgBanner'
import SectionText from '@/components/_sections/SectionText'
import SectionMarqueeText from '@/components/_sections/SectionMarqueeText'
import ProductGrid from '@/components/ProductGrid'
import { AnalyticsListItemProvider } from '@/hooks/Analytics'

const EditorialGrid = styled.div`
  ${theme.size.containerMargin('margin-left')}
  ${theme.size.containerMargin('margin-right')}
color: ${theme.colors.mono800};
  display: grid;
  ${theme.size.gutter('grid-gap')}
  grid-template-columns: 1fr 1fr;
  grid-auto-flow: row dense;
  ${mq['lg']} {
    grid-template-columns: repeat(12, 1fr);
  }
`
const Box = styled.div`
  position: relative;
  ${(p) => (p.slotsInRow === 1 ? 'grid-column: span 2; padding: 0 15%;' : '')}
  ${mq['lg']} {
    ${(p) => (p.slotsInRow === 1 ? `grid-column: 4 / span 6;` : ``)}
    ${(p) => (p.slotsInRow === 2 ? `grid-column: span 6;` : ``)}
  ${(p) => (p.slotsInRow === 3 ? 'grid-column: span 4;' : '')}
  grid-row: ${(p) => p.row};
    padding: 0;
  }
`
const SectionWrap = styled.div`
  grid-column: span 2;
  ${mq['lg']} {
    grid-row: ${(p) => p.row};
    grid-column: span 12;
  }
  ${theme.size.negativeContainerMargin('margin-left')}
  ${theme.size.negativeContainerMargin('margin-right')}
${theme.size.m('margin-top')}
${theme.size.l('margin-bottom')}
`

const CollectionGrid = ({ products, viewType, collectionHandle, editorialCollection }) => {
  let productSlots = 0
  let productsNotInSlots = []
  let lastRenderedProductIndex = 0
  let lastRenderedRowIndex = 0
  const DEBUG = false

  if (editorialCollection) {
    editorialCollection.rowsCollection.items.forEach((item) =>
      item.__typename === 'Slots' ? (productSlots = productSlots + item.slots) : null
    )

    if (productSlots < products.length) {
      for (let i = productSlots; i < products.length; i++) {
        productsNotInSlots.push(products[i])
      }
    }
  }

  return viewType === 'MIXED' ? (
    <EditorialGrid>
      {editorialCollection.rowsCollection.items.map((item) => {
        const currentRowIndex = lastRenderedRowIndex + 1
        lastRenderedRowIndex++
        if (item.__typename !== 'Slots') {
          let section = null

          switch (item.__typename) {
            case 'SectionMarqueeBanner':
              section = <SectionMarqueeBanner {...item} />
              break
            case 'SectionPortraitImages':
              section = <SectionPortraitImages {...item} />
              break
            case 'SectionSvgBanner':
              section = <SectionSvgBanner {...item} />
              break
            case 'SectionText':
              section = <SectionText {...item} />
              break
            case 'SectionMarqueeText':
              section = <SectionMarqueeText {...item} />
              break
            default:
              console.log(`Can't render type of section: ${item.__typename}`)
              break
          }

          return (
            <SectionWrap row={currentRowIndex} key={currentRowIndex}>
              {section}
            </SectionWrap>
          )
        } else {
          const items = []
          for (let i = 0; i < item.slots; i++) {
            items.push([`ROW:  ${currentRowIndex} \nITEM: ${i + 1}`])
          }

          return (
            <React.Fragment key={currentRowIndex}>
              {items.map((e) => {
                if (lastRenderedProductIndex + 1 > products.length) {
                  return null
                }
                const _product = products[lastRenderedProductIndex]
                lastRenderedProductIndex++
                return (
                  <Box row={currentRowIndex} slotsInRow={item.slots} key={'e_' + _product.id}>
                    {DEBUG && (
                      <pre
                        style={{
                          position: 'absolute',
                          pointerEvents: 'none',
                          zIndex: 1,
                          top: '16px',
                          left: '6px',
                          color: 'white',
                          background: '#444',
                          padding: '4px'
                        }}
                      >
                        {e}
                      </pre>
                    )}
                    <AnalyticsListItemProvider list={'category_editorial'} position={lastRenderedProductIndex}>
                      <ProductCard
                        product={_product}
                        collectionHandle={collectionHandle}
                        isHalfOnDesktop={item.slots < 3}
                      />
                    </AnalyticsListItemProvider>
                  </Box>
                )
              })}
            </React.Fragment>
          )
        }
      })}

      {productsNotInSlots.length > 0 &&
        productsNotInSlots.map((_product, i) => {
          lastRenderedProductIndex++
          if (i % 3 === 0) {
            lastRenderedRowIndex++
          }
          return (
            <Box key={'r_' + _product.id} row={lastRenderedRowIndex} slotsInRow={3}>
              <AnalyticsListItemProvider list={'category_editorial'} position={lastRenderedProductIndex}>
                <ProductCard product={_product} collectionHandle={collectionHandle} />
              </AnalyticsListItemProvider>
            </Box>
          )
        })}
    </EditorialGrid>
  ) : (
    <ProductGrid
      analyticsListName={'category'}
      columns={viewType === 'TWO_COLS' ? 2 : 3}
      products={products}
      collectionHandle={collectionHandle}
    />
  )
}

export default CollectionGrid
