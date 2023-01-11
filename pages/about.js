import React from 'react'
import { NextSeo } from 'next-seo'
import styled from '@emotion/styled'
import fetchGlobalSettings from '@/data/contentful/fetchGlobalSettings'
import AboutPage from '@/components/_pages/AboutPage'
import fetchAbout from '@/data/contentful/fetchAbout'

const Root = styled.div``

const Page = ({ data }) => {
  return (
    <Root>
      <NextSeo
        {...{
          title: data.title,
          description: data.seoDescription,
          nofollow: true,
          noindex: true,
          openGraph: {
            type: 'website',
            locale: 'en_IE',
            url: 'https://www.splits59.com/about',
            description: data.seoDescription,
            site_name: `SPLITS59 Fabric`
          }
        }}
      />

      <AboutPage {...data} />
    </Root>
  )
}

export async function getStaticProps({ preview = false, previewData = null }) {
  const responses = await Promise.all([fetchGlobalSettings(preview), fetchAbout()])

  const globalSettings = responses[0]
  const data = responses[1]

  const analyticsParams = {
    pageTitle: data.title + ' | ' + globalSettings?.pageTitleSuffix
  }

  return {
    props: { globalSettings, data, preview, previewData, analyticsParams },
    revalidate: 1
  }
}

export default Page
