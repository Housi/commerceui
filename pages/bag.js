import React from 'react'
import { NextSeo } from 'next-seo'
import styled from '@emotion/styled'
import fetchGlobalSettings from '@/data/contentful/fetchGlobalSettings'
import CartPage from '@/components/_pages/CartPage'

const Root = styled.div``

const Page = () => {
  return (
    <Root>
      <NextSeo
        {...{
          title: 'Cart',
          noindex: true,
          nofollow: true
        }}
      />
      <CartPage />
    </Root>
  )
}

export async function getStaticProps() {
  const responses = await Promise.all([fetchGlobalSettings()])

  const globalSettings = responses[0]

  const analyticsParams = {
    pageTitle: 'Cart | ' + globalSettings?.pageTitleSuffix
  }

  return {
    props: { globalSettings, analyticsParams },
    revalidate: 1
  }
}

export default Page
