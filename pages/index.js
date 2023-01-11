import React, { useEffect } from 'react'
import fetchGlobalSettings from '@/data/contentful/fetchGlobalSettings'
import fetchHome from '@/data/contentful/fetchHome'

import SectionMarqueeBanner from '@/components/_sections/SectionMarqueeBanner'
import SectionNewsletterForm from '@/components/_sections/SectionNewsletterForm'
import SectionPortraitImages from '@/components/_sections/SectionPortraitImages'
import SectionSvgBanner from '@/components/_sections/SectionSvgBanner'

import styled from '@emotion/styled'
import { lin, rs } from '@theme'
import Section5050 from '@/components/_sections/Section5050'
import { useAnalytics } from '@/hooks/Analytics'

const Root = styled.div`
  position: relative;
  display: grid;
  ${(p) => (p.rowGap >= 0 && p.rowGapMobile >= 0 ? lin('grid-gap', p.rowGapMobile, p.rowGap) : ``)}
`
const Index = ({ page }) => {
  const Analytics = useAnalytics()

  useEffect(() => {
    Analytics.pageView()
  }, [])

  const gaps = {
    rowGap: page.rowGap ?? 0,
    rowGapMobile: page.rowGapMobile ?? 0,
    columnGap: page.columnGap ?? 0,
    columnGapMobile: page.columnGapMobile ?? 0
  }

  return (
    <>
      <Root {...gaps}>
        {page.sectionsCollection.items.map((section, i) => {
          if (!section) {
            return null
          }

          switch (section.__typename) {
            case 'SectionMarqueeBanner':
              return <SectionMarqueeBanner {...section} key={i} />
            case 'SectionPortraitImages':
              return <SectionPortraitImages {...section} key={i} />
            case 'SectionNewsletterForm':
              return <SectionNewsletterForm key={i} />
            case 'SectionSvgBanner':
              return <SectionSvgBanner {...section} key={i} priority={i === 0} />
            case 'Section5050':
              return <Section5050 {...section} key={i} priority={i === 0} {...gaps} />
            default:
              console.log(`Can't render type of section: ${section.__typename}`)
              return null
          }
        })}
      </Root>
    </>
  )
}

export async function getStaticProps({ preview = false, previewData = null }) {
  const responses = await Promise.all([fetchGlobalSettings(preview), fetchHome(previewData?.entryId ?? null)])

  const globalSettings = responses[0]
  const page = responses[1]

  const analyticsParams = {
    event: 'HomeView',
    pageType: 'home',
    ecomm_pagetype: 'home',
    pageTitle: globalSettings?.seoTitle + ' | ' + globalSettings?.pageTitleSuffix
  }

  return {
    props: { globalSettings, page, preview, previewData, analyticsParams },
    revalidate: 1
  }
}

export default Index
