import React, { useState, useRef, useEffect } from 'react'
import styled from '@emotion/styled'

import { theme, mq, lin } from '@theme'

import { ButtonLogo, ButtonBlock, ButtonPrimary } from '@button'
import fetchSearchResults from '@/data/shopify/fetchSearchResults'
import Image from '@image'
import ProductPrice from '@/components/ProductPrice'
import { ButtonNavTab } from '@button'
import Container from '@/components/Container'
import ProductGrid from '@/components/ProductGrid'
import { AnalyticsListItemProvider, useAnalytics } from '@/hooks/Analytics'

const Rows = styled.div`
  display: grid;
  ${theme.size.s('padding')}
  ${theme.size.s('grid-row-gap')}
${mq['lg']} {
    overflow-y: auto;
  }
`
const Root = styled.div`
  opacity: ${(props) => (props.isLocked ? '0' : '1')};
  transition: opacity 300ms;
`
const ListWrap = styled.div`
  position: relative;
  overflow-y: auto;
  height: calc(100vh - 100px);
  ${mq['lg']} {
    display: flex;
    flex-direction: column;
    overflow-y: visible;
    height: 100%;
    min-height: 300px;
    max-height: 70vh;
  }
`
const Spacer = styled.div`
  height: 50vh;
  display: block;
  ${mq['lg']} {
    display: none;
  }
`

const Footer = styled.div`
  border-top: 1px solid ${theme.colors.mono200};
  ${theme.size.s('padding')}
`
const ProductBox = styled.div`
  display: grid;
  grid-template-columns: 70px 1fr;
  align-items: center;
  ${theme.size.s('grid-column-gap')}
`
const ProductInfo = styled.div`
  ${theme.font.caps07}
  s {
    color: ${theme.colors.mono500};
  }
`
const ProductTitle = styled.div``

const ResultsTitle = styled.h1`
  ${theme.size.menuBarHeight('margin-top')}
  ${theme.size.m('padding-top')}
${theme.size.m('padding-bottom')}
${theme.font.caps02}
`

const ProductRow = ({ product }) => {
  const Analytics = useAnalytics()

  return (
    <ButtonBlock href={'/products/' + product.handle} onClick={() => Analytics.productClick(product, true)}>
      <ProductBox>
        <Image image={product.primaryImage} sizes={'70px'} />
        <ProductInfo>
          <ProductTitle>{product.title}</ProductTitle>
          <ProductPrice price={product.price} compareAtPrice={product.compareAtPrice} />
        </ProductInfo>
      </ProductBox>
    </ButtonBlock>
  )
}

const ProductGridResults = ({ products, value, fullPageView, isLocked }) => {
  return (
    <Root isLocked={isLocked}>
      {products && fullPageView ? (
        <>
          <Container>
            <ResultsTitle>
              {products.length === 1
                ? `Found 1 product for "${value}"`
                : `${products.length} products found for "${value}"`}
            </ResultsTitle>
          </Container>
          <ProductGrid analyticsListName={'searchresults'} products={products} />
        </>
      ) : (
        <ListWrap>
          <Rows>
            {products.map((product, i) => {
              if (i > 5) {
                return null
              }
              return (
                <AnalyticsListItemProvider key={i} list={'searchresults'} position={i + 1}>
                  <ProductRow product={product} />
                </AnalyticsListItemProvider>
              )
            })}
          </Rows>
          <Footer>
            <ButtonNavTab isActive href={'/search?data=' + value}>
              View all
            </ButtonNavTab>
          </Footer>
          <Spacer />
        </ListWrap>
      )}
    </Root>
  )
}

const NoResultsStyled = styled.div`
  background: white;
  ${theme.size.s('padding')}
  ${theme.font.caps07}
  text-align: center;
  ${(props) =>
    props.fullPageView
      ? `
  height: 100vh; display: flex; align-items: center; justify-content: center;
  `
      : ``}
`

const NoResults = ({ fullPageView, value }) => {
  return (
    <NoResultsStyled fullPageView={fullPageView}>
      No results found
      {fullPageView && 'for "{value}"'}
    </NoResultsStyled>
  )
}

const Loader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: black;
  width: 100%;
  height: 100%;
`
const SearchResults = ({ value, onChange, fullPageView, globalSettings }) => {
  const [isLoading, setLoading] = useState(true)
  const [isLocked, setLocked] = useState(false)
  const [result, setResult] = useState(null)

  const timeout = useRef(null)

  useEffect(() => {
    clearTimeout(timeout.current)

    if (value === '') {
      setResult(null)
      setLoading(false)
    } else {
      if (fullPageView) {
        setLocked(true)
        setResult(null)
        // console.log('fullPageView')
      }
      timeout.current = setTimeout(() => {
        setLoading(true)
      }, 1000)
      fetchSearchResults(value).then((res) => {
        clearTimeout(timeout.current)
        setResult(res)
        setLoading(false)
        setLocked(false)
      })
    }
  }, [value])

  if (isLoading) {
    return <Loader />
  }

  if (!result || value === '') {
    return <></>
  }

  if (result.products.length > 0) {
    return (
      <ProductGridResults
        products={result.products}
        value={value}
        isLocked={isLocked}
        fullPageView={fullPageView}
        globalSettings={globalSettings}
      />
    )
  } else {
    return <NoResults fullPageView={fullPageView} value={value} onChange={onChange} />
  }
}

export default SearchResults
