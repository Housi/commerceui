import React, { useEffect } from 'react'

import ProductDetails from '@/components/ProductDetails'
import { useRouter } from 'next/router'
import fetchAllProductHandles from '@/data/shopify/fetchAllProductHandles'
import fetchProduct from '@/data/shopify/fetchProduct'

import { NextSeo, ProductJsonLd } from 'next-seo'

import PageLoader from '@/components/PageLoader'
import styled from '@emotion/styled'
import { mq, theme } from '@theme'

import ProductGallery from '@/components/ProductGallery'
import fetchGlobalSettings from '@/data/contentful/fetchGlobalSettings'

import getShopifyImageSrc from '@/helpers/getShopifyImageSrc'
import ProductGrid from '@/components/ProductGrid'
import { useAnalytics } from '@/hooks/Analytics'

const Root = styled.div``

const Head = styled.div`
  position: relative;
  display: grid;
  ${mq['lg']} {
    grid-template-columns: 1fr 500px;
  }
  ${mq['xl']} {
    grid-template-columns: minmax(800px, 1fr) minmax(500px, 580px);
  }
  ${mq['xxl']} {
    grid-template-columns: 2fr 1fr;
  }
`

const RestWrapper = styled.div`
  ${theme.size.xl('margin-top')}
`
const ProductDetailsColumn = styled.div`
  ${theme.size.m('padding-top')}
  ${mq['lg']} {
    min-height: 100vh;
    ${theme.size.m('padding-left')}
    ${theme.size.m('padding-right')}
    padding-top: 0;
  }
`
const ProductDetailsInner = styled.div`
  ${theme.size.containerMargin('margin-left')}
  ${theme.size.containerMargin('margin-right')}
${mq['lg']} {
    max-width: 560px;
    margin-left: auto;
    margin-right: auto;
    ${theme.size.xl('padding-top')}
    ${(props) =>
      props.isBundle
        ? ''
        : `
    position: sticky;
    top: 0;
  `}
  }
`
const ProductDetailsPage = ({ product }) => {
  const router = useRouter()
  const Analytics = useAnalytics()

  useEffect(() => {
    Analytics.pageView()
  }, [])

  if (router.isFallback) {
    return <PageLoader />
  }

  const isBundle = product.bundlePieces?.length > 1

  return (
    <Root>
      <NextSeo
        {...{
          nofollow: product.tags.includes('test-product'),
          title: product.originalTitle,
          description: product.description,
          openGraph: {
            type: 'website',
            locale: 'en_IE',
            url: 'https://www.splits59.com/products/' + product.handle,
            description: product.description,
            site_name: `SPLITS59 Product`,
            images: [
              {
                url: getShopifyImageSrc({
                  src: product.primaryImage.originalSrc,
                  width: 400,
                  height: 600,
                  crop: 'center'
                }),
                width: 400,
                height: 600
              }
            ]
          },
          twitter: {
            label1: 'Price',
            data1: product.price.amount + ' ' + product.price.currencyCode,
            label2: 'Color',
            data2: product.color
          }
        }}
      />

      <ProductJsonLd
        productName={product.title}
        images={[
          getShopifyImageSrc({
            src: product.primaryImage.originalSrc,
            width: 400,
            height: 600,
            crop: 'center'
          })
        ]}
        description={product.description}
        brand={product.vendor}
        color={product.color}
        releaseDate={product.publishedAt}
        offers={[
          {
            price: product.price.amount,
            priceCurrency: product.price.currencyCode,
            url: 'https://www.splits59.com/products/' + product.handle,
            seller: {
              name: 'Executive Objects'
            }
          }
        ]}
      />

      <Head className={'HEAD'}>
        <ProductGallery media={product.media} isBundle={isBundle} />
        <ProductDetailsColumn>
          <ProductDetailsInner isSticky={!isBundle}>
            <ProductDetails product={product} key={product.handle} />
          </ProductDetailsInner>
        </ProductDetailsColumn>
      </Head>

      {product.stylesWithProducts && product.stylesWithProducts.length > 0 && (
        <RestWrapper>
          <ProductGrid
            products={product.stylesWithProducts}
            title={'Pairs well with'}
            analyticsListName={'related_products'}
          />
        </RestWrapper>
      )}
    </Root>
  )
}

export async function getStaticPaths() {
  let paths = []

  if (process.env.IS_VERCEL_PREVIEW !== 'true') {
    const handles = await fetchAllProductHandles()

    paths = handles.map((h) => ({ params: h }))
  }

  return { paths: [] /* for 413 task purposes only */, fallback: true }
}

export async function getStaticProps({ params }) {
  const responses = await Promise.all([fetchGlobalSettings(), fetchProduct(params.handle, true)])

  const globalSettings = responses[0]
  const product = responses[1]

  if (!product) {
    return {
      notFound: true
    }
  }

  let analyticsParams = {
    pageType: 'product',
    pageTitle: product.originalTitle + ' | ' + globalSettings?.pageTitleSuffix,
    collection: product.collections[0]?.title ?? null,
    productType: product.productType ?? null,
    ecomm_pagetype: 'product'
  }

  return {
    props: { product, globalSettings, analyticsParams },
    revalidate: 10
  }
}

export default ProductDetailsPage
