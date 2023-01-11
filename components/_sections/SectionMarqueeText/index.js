import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { theme } from '@theme'

import Marquee from 'react-fast-marquee'

const Root = styled.div`
  position: relative;
`
const MarqueeWrap = styled.div`
  ${theme.font.caps05}
  ${theme.size.m('margin-bottom')}
${theme.size.m('margin-top')}

display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  opacity: ${(props) => (props.isLoaded ? 1 : 0)};
  transition: all 50ms;
  pointer-events: none;
  white-space: nowrap;
  width: 100%;
  z-index: 1;
`

const SectionMarqueeText = ({ text }) => {
  const [isLoaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  })

  const length = 3
  for (let i = 0; i < length; i++) {
    text = text + ' ' + text
  }

  return (
    <Root>
      <MarqueeWrap isLoaded={isLoaded}>
        <Marquee gradient={false} speed={50}>
          {text}
        </Marquee>
      </MarqueeWrap>
    </Root>
  )
}

export default SectionMarqueeText
