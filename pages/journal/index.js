import React from 'react'
import { NextSeo } from 'next-seo'
import styled from '@emotion/styled'
import fetchGlobalSettings from '@/data/contentful/fetchGlobalSettings'
import JournalPage from '@/components/_pages/JournalPage'
import fetchAllJournalEntries from '@/data/contentful/fetchAllJournalEntries'

const Root = styled.div``

const PAGE_TITLE = 'Jorunal'

const Page = ({ entries }) => {
  return (
    <>
      <NextSeo
        {...{
          title: PAGE_TITLE,
          nofollow: true,
          noindex: true
        }}
      />
      <JournalPage entries={entries} title={PAGE_TITLE} />
    </>
  )
}

export async function getStaticProps() {
  const responses = await Promise.all([fetchGlobalSettings(), fetchAllJournalEntries()])

  const globalSettings = responses[0]
  const entries = responses[1]

  const analyticsParams = {
    pageTitle: `${PAGE_TITLE} | ${globalSettings?.pageTitleSuffix}`
  }

  return {
    props: { globalSettings, analyticsParams, entries },
    revalidate: 1
  }
}

export default Page
