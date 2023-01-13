import React from 'react'

import { NextSeo } from 'next-seo'

import styled from '@emotion/styled'
import fetchGlobalSettings from '@/data/contentful/fetchGlobalSettings'
import fetchAllJournalEntries from '@/data/contentful/fetchAllJournalEntries'
import fetchJournalEntryByHandle from '@/data/contentful/fetchJournalEntryByHandle'
import JournalEntryPage from '@/components/_pages/JournalEntryPage'

const Root = styled.div``

const Page = ({ entry, allEntries }) => {
  const restEntries = allEntries.filter((e) => e.slug !== entry.slug)

  return (
    <Root>
      <NextSeo
        {...{
          title: entry.title,
          description: entry.lead,
          nofollow: true,
          noindex: true,
          openGraph: {
            type: 'website',
            locale: 'en_IE',
            url: 'https://www.splits59.com/journal/' + entry.slug,
            description: entry.lead,
            site_name: `SPLITS59 Fabric`
          }
        }}
      />
      <JournalEntryPage {...entry} relatedEntries={[restEntries[1], restEntries[2]]} />
    </Root>
  )
}

export async function getStaticPaths() {
  let paths = []

  if (process.env.IS_VERCEL_PREVIEW !== 'true') {
    const entries = await fetchAllJournalEntries()
    paths = entries.map((entry) => ({ params: { handle: entry.slug } }))
  }

  return { paths: [] /* modification only for the purpose of 413 task */ , fallback: true }
}

export async function getStaticProps({ params, preview = false, previewData = null }) {
  const responses = await Promise.all([
    fetchGlobalSettings(),
    fetchAllJournalEntries(),
    fetchJournalEntryByHandle(params.handle, preview)
  ])

  const globalSettings = responses[0]
  const allEntries = responses[1]
  const entry = responses[2]

  if (!entry) {
    return {
      notFound: true
    }
  }

  const analyticsParams = {
    pageTitle: entry.title + ' | ' + globalSettings?.pageTitleSuffix
  }

  return {
    props: { entry, globalSettings, allEntries, previewData, analyticsParams },
    revalidate: 1
  }
}

export default Page
