import React, { useEffect } from 'react'
import fetchGlobalSettings from '../data/contentful/fetchGlobalSettings'
import fetchUtilityPageByHandle from '../data/contentful/fetchUtilityPageByHandle'
import UtilityPage from '../components/_pages/UtilityPage'
import { useAnalytics } from '../hooks/Analytics'

const Index = ({ globalSettings, page, preview }) => {
  const Analytics = useAnalytics()

  useEffect(() => Analytics.pageView(), [])

  return (
    <>
      {preview}
      <UtilityPage data={page} />
    </>
  )
}

export async function getStaticProps({ params, preview = false, previewData = null }) {
  // preview = false
  // console.log(preview)

  const responses = await Promise.all([
    fetchGlobalSettings(preview),
    fetchUtilityPageByHandle('accessibility', preview)
  ])

  const globalSettings = responses[0]
  const page = responses[1]

  const analyticsParams = {
    pageTitle: page.title + ' | ' + globalSettings?.pageTitleSuffix
  }

  return {
    props: { globalSettings, page, preview, previewData, analyticsParams },
    revalidate: 1
  }
}

export default Index
