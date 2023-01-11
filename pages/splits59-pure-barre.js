import React, { useEffect } from 'react'
import fetchGlobalSettings from '@/data/contentful/fetchGlobalSettings'
import { NextSeo } from 'next-seo'
import Image from '@/components/Image'
import { ButtonBlock } from '@/components/Button'
import { theme } from '@theme'

import styled from '@emotion/styled'
import { useAnalytics } from '@/hooks/Analytics'

const Root = styled.div`
  ${theme.size.containerMargin('margin-left')}
  ${theme.size.containerMargin('margin-right')}
${theme.size.menuBarHeight('padding-top')}
`

const Index = () => {
  const Analytics = useAnalytics()

  useEffect(() => Analytics.pageView(), [])

  return (
    <>
      <NextSeo
        {...{
          title: `SPLIS59 Pure Barre"`
        }}
      />
      <Root>
        <ButtonBlock href={'https://form.jotform.com/211514326360041'} target={'_blank'}>
          <Image
            image={{
              src: 'https://splits59.com/img/SPLITS59_BRAND_DECK_2021_PURE_BARRE.jpeg',
              width: 2550,
              height: 3300
            }}
            sizes={`90vw`}
          />
        </ButtonBlock>
      </Root>
    </>
  )
}

export async function getStaticProps({ params, preview, previewData }) {
  const responses = await Promise.all([fetchGlobalSettings()])

  const globalSettings = responses[0]

  return {
    props: { globalSettings }
  }
}

export default Index
