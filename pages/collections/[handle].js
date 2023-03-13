import React, { useEffect } from 'react'

import fetchCollection, { filterCollection } from '@/data/shopify/fetchCollection'
import fetchAllCollectionHandles from '@/data/shopify/fetchAllCollectionHandles'

import fetchGlobalSettings from '../../data/contentful/fetchGlobalSettings'
import fetchEditorialCollectionByHandle from '../../data/contentful/fetchEditorialCollectionByHandle'
import decomposeCollectionHandle from '../../components/_pages/Collection/decomposeCollectionHandle'
import Collection from '../../components/_pages/Collection'
import { useAnalytics } from '@/hooks/Analytics'

function Page(props) {
  const Analytics = useAnalytics()
  const { filters, collection, pagination } = filterCollection(props.fullCollection, props.filterValues)
  useEffect(() => {
    Analytics.pageView()
  }, [])
  return <Collection {...{ ...props, filters, collection, pagination }} key={collection.handle} />
}

export async function getStaticPaths() {
  let paths = []
  if (process.env.IS_VERCEL_PREVIEW !== 'true') {
    const handles = await fetchAllCollectionHandles()
    paths = handles.map((h) => ({ params: h }))
  }
  return { paths: [] /* modification only for the purpose of 413 task */, fallback: true }
}

export async function getStaticProps({ params, preview = false, previewData = null }) {
  const { handle, values } = decomposeCollectionHandle(params.handle)

  // console.log("collection getStaticProps", handle)

  const responses = await Promise.all([
    fetchGlobalSettings(),
    fetchCollection(handle),
    fetchEditorialCollectionByHandle(handle, preview)
  ])

  // Full collection is full unfiltered collection that is then used as a cache so that we don't have to make API request to Shopify ever again.
  // This makes sense only until number of products in collection is not large. For now it's totally fine, as Shopify API is slow.
  const globalSettings = responses[0]
  const fullCollection = responses[1]
  const editorialCollection = responses[2]

  if (!fullCollection) {
    return {
      notFound: true
    }
  }

  const analyticsParams = {
    pageType: 'category',
    pageTitle: fullCollection.title + ' | ' + globalSettings?.pageTitleSuffix,
    collection: fullCollection.title, // afaik this was copied from fullCollection anyway
    ecomm_pagetype: 'category'
  }

  return {
    props: {
      globalSettings,
      fullCollection,
      editorialCollection,
      preview,
      previewData,
      analyticsParams,
      filterValues: values
    },
    revalidate: 10
  }
}

export default Page
