import React, { useState, useEffect } from 'react'
import { ButtonBlock } from '@button'
import Image from '@image'
import styled from '@emotion/styled'
import { theme, mq } from '@theme'

import Marquee from 'react-fast-marquee'
import { ButtonSecondary } from '@button'

const Root = styled.div`
  position: relative;
`
const Grid = styled.div`
  position: relative;
  ${mq['lg']} {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
`

const ImageWrap = styled.div`
  ${mq['lg']} {
    grid-column: 2 / span 3;
  }
  ${(props) =>
    props.mobile
      ? `${mq['lg']} {display: none;}`
      : `
display: none;
${mq['lg']} {display: block;}
`}
`

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  opacity: ${(props) => (props.isLoaded ? 1 : 0)};
  transition: all 50ms;
  pointer-events: none;
`
const MarqueeWrap = styled.div`
  ${theme.font.caps05}
  ${theme.size.l('margin-bottom')}
white-space: nowrap;
  width: 100%;
  z-index: 1;
  opacity: 0.99;
  color: ${(props) => (props.isWhite ? 'white' : 'black')};
`

const SectionMarqueeBanner = ({ movingText, image, imageMobile, buttonLabel, buttonHref, isContentWhite }) => {
  const [isLoaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  })

  const length = 3
  for (let i = 0; i < length; i++) {
    movingText = movingText + ' ' + movingText
  }

  return (
    <Root>
      <ButtonBlock href={buttonHref}>
        <Grid>
          <ImageWrap>
            <Image image={image} sizes={'100vw'} priority />
          </ImageWrap>

          <ImageWrap mobile>
            <Image image={imageMobile} sizes={'100vw'} priority />
          </ImageWrap>
        </Grid>
      </ButtonBlock>

      <Overlay isLoaded={isLoaded}>
        <MarqueeWrap isWhite={isContentWhite}>
          <Marquee gradient={false} speed={50}>
            {movingText}
          </Marquee>
        </MarqueeWrap>

        <ButtonSecondary href={buttonHref} isWhite={isContentWhite} style={{ pointerEvents: 'all' }}>
          {buttonLabel}
        </ButtonSecondary>
      </Overlay>
    </Root>
  )
}

export default SectionMarqueeBanner
