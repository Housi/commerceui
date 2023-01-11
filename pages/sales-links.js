import React, { useEffect } from 'react'

import fetchGlobalSettings from '../data/contentful/fetchGlobalSettings'
import fetchUtilityPageByHandle from '../data/contentful/fetchUtilityPageByHandle'

import UtilityPage from '../components/_pages/UtilityPage'
import { useAnalytics } from '@/hooks/Analytics'

const Index = ({ data }) => {
  const Analytics = useAnalytics()
  useEffect(() => Analytics.pageView(), [])

  return (
    <>
      <UtilityPage data={data} noindex nofollow />
    </>
  )
}

export async function getStaticProps({ preview = false, previewData = null }) {
  const responses = await Promise.all([fetchGlobalSettings(preview), fetchUtilityPageByHandle('sales-links', preview)])

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

export default Index
