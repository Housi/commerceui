import React from 'react'
import fetchGlobalSettings from "../data/contentful/fetchGlobalSettings";
import {NextSeo} from "next-seo";
import Error404Content from "../components/Error404Content";

const ShippingPage = ({}) => {
  return <>

    <NextSeo
      {
        ...{
          title: `404`
        }
      }
    />

    <Error404Content/>

  </>;
};

ShippingPage.headerTheme = "WHITE";


export async function getStaticProps() {

  const responses = await Promise.all([
    fetchGlobalSettings(),
  ])
  const globalSettings = responses[0] ;
  return {
    props: {
      globalSettings
    }
  }
}

export default ShippingPage