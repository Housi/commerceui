import React from 'react'
import fetchGlobalSettings from "../data/contentful/fetchGlobalSettings";

const ShippingPage = ({}) => {
  return <>
  500
    {/*<Error404/>*/}

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