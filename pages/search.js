import React, {useEffect} from 'react'
import SearchResults from "../components/NavBar/SearchResults";
import { useRouter } from 'next/router'
import fetchGlobalSettings from "../data/contentful/fetchGlobalSettings";
import {NextSeo} from "next-seo";
import {useAnalytics} from "../hooks/Analytics";

const Index = ({globalSettings}) => {

  const router = useRouter();

  const Analytics = useAnalytics()
  useEffect(() => Analytics.pageView(), [])

  useEffect(() => {
    Analytics.search(router.query.data);
  }, [router.query.data])


  return <>

    <NextSeo
      {
        ...{
          title: `Search results for "${router.query.data}"`
        }
      }
    />

    <SearchResults
      value={router.query.data}
      globalSettings={globalSettings}
      fullPageView
    />

  </>;
};


export async function getStaticProps() {

  const responses = await Promise.all([
    fetchGlobalSettings(),
  ]);

  const globalSettings = responses[0];

  const analyticsParams = {
    pageType: "searchresults",
    ecomm_pagetype: "category",
    pageTitle: `Search results | ${globalSettings?.pageTitleSuffix}` ,
  }

  return {
    props: {globalSettings, analyticsParams}
  }
}

export default Index
