import Head from 'next/head'
import React, { useEffect, useState } from 'react'

import StoreProvider from '@/data/shopify/StoreProvider'

import { DefaultSeo } from 'next-seo'

import { useRouter } from 'next/router'
import PageLoader from '@/components/PageLoader'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

import { UIProvider } from '@/hooks/UI'
import Cart from '@/components/Cart'
import Modal from 'react-modal'
import NavModal from '@/components/NavModal'
import PreviewBar from '@/components/PreviewBar'
import { Global, css } from '@emotion/react'

import styled from '@emotion/styled'
import { rs, theme } from '@theme'
import { SettingsProvider } from '@/hooks/Settings'
import PromoBar from '@/components/PromoBar'
import { CustomerProvider, useCustomer } from '@/hooks/Customer'
import sleep from '@/helpers/sleep'
import { useAnalytics, AnalyticsPageContextProvider } from '@/hooks/Analytics'

const SkipStyled = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  top: 4px;
  left: 0;
  width: 100%;
  z-index: 2;
  a {
    ${theme.font.caps07}
    background: black;
    color: white;
    padding: 4px;
    position: absolute;
    opacity: 0;
    pointer-events: none;
    &:focus {
      opacity: 1;
      pointer-events: all;
    }
  }
`
const SkipToMainContent = () => {
  return (
    <SkipStyled>
      <a href={'#appWrapper'}>Skip to main content</a>
    </SkipStyled>
  )
}

const AppWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  ${rs('margin-top', ['-70px', null, '-105px'])}
`

function MyApp({ Component, pageProps }) {
  const [customerData, setCustomerData] = useState(null)

  const router = useRouter()
  const Analytics = useAnalytics()

  useEffect(async () => {
    // set customer data when window.customerData from _document appears

    let data
    while (!data) {
      if (window.customerData) {
        data = window.customerData
      }
      await sleep(500)
    }
    setCustomerData(data)
    Analytics.setCustomerData(data)
  }, [])

  useEffect(() => {
    Modal.setAppElement('#modalContainer')
    Modal.defaultStyles.overlay = {}
  }, [])

  if (router.isFallback) {
    return (
      <>
        <PageLoader />
        <div id={'modalContainer'} />
      </>
    )
  }

  return (
    <StoreProvider>
      <UIProvider>
        <CustomerProvider hotData={customerData}>
          <SettingsProvider settings={pageProps.globalSettings}>
            <AnalyticsPageContextProvider {...pageProps.analyticsParams}>
              <Global
                styles={css`
                  ${theme.globalStyles}
                `}
              />

              <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
              </Head>

              <DefaultSeo
                {...{
                  title: pageProps.globalSettings?.seoTitle,
                  titleTemplate: '%s | ' + pageProps.globalSettings?.pageTitleSuffix,
                  description: pageProps.globalSettings?.seoDescription,
                  openGraph: {
                    type: 'website',
                    locale: 'en_IE',
                    url: 'https://www.splits59.com/',
                    description: pageProps.globalSettings?.seoDescription,
                    site_name: `${pageProps.globalSettings?.openGraphSiteName}`,
                    images: [
                      {
                        url: pageProps.globalSettings?.openGraphDefaultImage?.src,
                        width: pageProps.globalSettings?.openGraphDefaultImage?.width,
                        height: pageProps.globalSettings?.openGraphDefaultImage?.height
                      }
                    ]
                  },
                  twitter: {
                    handle: '@Splits59',
                    site: '@site',
                    cardType: 'summary_large_image'
                  }
                }}
              />

              <SkipToMainContent />
              <PromoBar />
              <NavBar />
              <NavModal tabs={pageProps.globalSettings?.menu.tabs} />
              <Cart />
              <PreviewBar isPreview={pageProps.preview} {...pageProps.previewData} />

              <AppWrapper id={'appWrapper'}>
                <Component {...pageProps} />
              </AppWrapper>

              <Footer
                firstColumnLinks={pageProps.globalSettings?.footer.firstColumnLinks}
                secondColumnLinks={pageProps.globalSettings?.footer.secondColumnLinks}
              />

              <div id={'modalContainer'} />
            </AnalyticsPageContextProvider>
          </SettingsProvider>
        </CustomerProvider>
      </UIProvider>
    </StoreProvider>
  )
}

export default MyApp
