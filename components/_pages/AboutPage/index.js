import React, { useState } from 'react'
import styled from '@emotion/styled'
import { theme, mq } from '@theme'
import Image from '@image'
import SectionMaker from '@/components/_sections/SectionMaker'

const PageTitle = styled.div`
  ${theme.size.menuBarHeight('margin-top')}
  ${theme.size.m('margin-bottom')}
  ${theme.size.m('padding-top')}
  ${theme.size.containerMargin('padding-left')}
  ${theme.size.containerMargin('padding-right')}
  ${theme.font.caps03}
`
const Root = styled.div`
  display: grid;
  ${theme.size.xl('grid-row-gap')}
`

const Hero = styled.div`
  position: relative;
`
const SectionsWrap = styled.div`
  display: grid;
  ${theme.size.xl('grid-row-gap')}
`
const AboutPage = ({ title, image, imageMobile, sections }) => {
  return (
    <Root>
      <Hero>
        <PageTitle>{title}</PageTitle>
        <div style={{ position: 'relative' }}>
          <div className={'hide-on-mobile'}>
            <Image image={image} />
          </div>
          <div className={'hide-on-desktop'}>
            <Image image={imageMobile} />
          </div>
        </div>
      </Hero>

      {sections && sections.length > 0 && (
        <SectionsWrap>
          {sections.map((s, i) => {
            return <SectionMaker key={i} {...s} />
          })}
        </SectionsWrap>
      )}
    </Root>
  )
}

export default AboutPage
