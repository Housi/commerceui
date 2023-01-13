import React from 'react'

import { NextSeo } from 'next-seo'

import Error404Content from '@/components/Error404Content'
import styled from '@emotion/styled'
import fetchGlobalSettings from '@/data/contentful/fetchGlobalSettings'
import fetchFabricPageByHandle from '@/data/contentful/fetchFabricPageByHandle'
import FabricPage from '@/components/_pages/FabricPage'
import fetchAllFabrics from '@/data/contentful/fetchAllFabrics'

const Root = styled.div``

const ProductDetailsPage = ({ fabric, allFabrics }) => {
  if (!fabric) {
    console.log('no fabric found')
    return <Error404Content />
  }

  return (
    <Root>
      <NextSeo
        {...{
          noindex: true,
          nofollow: true,
          title: fabric.name,
          description: fabric.seoDescription,
          openGraph: {
            type: 'website',
            locale: 'en_IE',
            url: 'https://www.splits59.com/fabrics/' + fabric.slug,
            description: fabric.seoDescription,
            site_name: `SPLITS59 Fabric`
          }
        }}
      />

      <FabricPage fabric={fabric} allFabrics={allFabrics} />
    </Root>
  )
}

export async function getStaticPaths() {
  let paths = []

  if (process.env.IS_VERCEL_PREVIEW !== 'true') {
    const fabrics = await fetchAllFabrics()
    paths = fabrics.map((fabric) => ({ params: { handle: fabric.slug } }))
  }

  return { paths: [] /* modification only for the purpose of 413 task */ , fallback: true }
}

export async function getStaticProps({ params }) {
  const responses = await Promise.all([
    fetchGlobalSettings(),
    fetchFabricPageByHandle(params.handle),
    fetchAllFabrics()
  ])

  const globalSettings = responses[0]
  const fabric = responses[1]
  const allFabrics = responses[2]

  return {
    props: { fabric, globalSettings, allFabrics },
    revalidate: 1
  }
}

export default ProductDetailsPage
