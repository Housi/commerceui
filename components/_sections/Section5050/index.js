import React from 'react'
import styled from '@emotion/styled'
import { theme, mq, lin } from '@theme'
import SectionSvgBanner from '@/components/_sections/SectionSvgBanner'

const Root = styled.div`
  .hide-on-mobile {
    display: none;
    ${mq['lg']} {
      display: block;
    }
  }
  display: grid;
  ${mq['lg']} {
    grid-template-columns: repeat(2, 1fr);
  }
  ${(p) => (p.rowGap >= 0 && p.rowGapMobile >= 0 ? lin('grid-row-gap', p.rowGapMobile, p.rowGapMobile) : ``)}
  ${(p) =>
    p.columnGap >= 0 && p.columnGapMobile >= 0 ? lin('grid-column-gap', p.columnGapMobile, p.columnGapMobile) : ``}
`
const Section5050 = ({
  firstBanner,
  isFirstBannerHiddenOnMobile,
  secondBanner,
  isSecondBannerHiddenOnMobile,
  columnGap,
  columnGapMobile
}) => {
  return (
    <Root columnGap={columnGap} columnGapMobile={columnGapMobile}>
      <div className={isFirstBannerHiddenOnMobile ? 'hide-on-mobile' : null}>
        <SectionSvgBanner {...firstBanner} isHalfOnDesktop isFullBleed={true} />
      </div>
      <div className={isSecondBannerHiddenOnMobile ? 'hide-on-mobile' : null}>
        <SectionSvgBanner {...secondBanner} isHalfOnDesktop isFullBleed={true} />
      </div>
    </Root>
  )
}

export default Section5050
