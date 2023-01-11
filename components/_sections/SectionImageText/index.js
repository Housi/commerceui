import React from 'react'
import Image from '@image'
import styled from '@emotion/styled'
import { theme, mq } from '@theme'

import putImageSizes from '../../../helpers/putImageSizes'
import { ButtonSecondary } from '@button'

const Root = styled.div`
  position: relative;
  ${(p) =>
    p.isFullBleed
      ? ``
      : `
    ${theme.size.containerMargin('padding-left')}
    ${theme.size.containerMargin('padding-right')}
  `}
  display: grid;
  ${theme.size.gutter('grid-gap')}
  ${mq['lg']} {
    grid-template-columns: 1fr 1fr;
  }
`
const ImageWrap = styled.div`
  ${mq['lg']} {
    ${(p) => (p.isTextFirst ? 'grid-column: 2; grid-row: 1;' : '')}
  }
`
const Text = styled.div`
  align-self: center;
  h2 {
    ${theme.font.caps03}
  }
  ${mq['lg']} {
    width: 420px;
    margin: 0 auto;
  }
  div {
    margin: 1em 0;
    ${theme.font.body01}
  }
  ${mq['lg']} {
    ${(p) => (p.isTextFirst ? 'grid-column: 1; grid-row: 1;' : '')}
  }
`
const SectionImageText = ({ image, image2, title, text, isTextFirst, buttonLabel, buttonHref }) => {
  return (
    <Root>
      <ImageWrap isTextFirst={isTextFirst}>
        {image && <Image image={image} sizes={putImageSizes(['100vw', null, null, '50vw'])} />}
      </ImageWrap>
      {image2 && <Image image={image2} sizes={putImageSizes(['100vw', null, null, '50vw'])} />}
      {title && (
        <Text isTextFirst={isTextFirst}>
          <h2>{title}</h2>
          <div dangerouslySetInnerHTML={{ __html: text }} />
          {buttonLabel && buttonHref && <ButtonSecondary href={buttonHref}>{buttonLabel}</ButtonSecondary>}
        </Text>
      )}
    </Root>
  )
}

export default SectionImageText
