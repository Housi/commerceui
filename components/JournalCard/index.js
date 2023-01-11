import React, { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { theme, mq } from '@theme'
import Image from '@image'
import Button, { ButtonBlock } from '@button'
import putImageSizes from '@/helpers/putImageSizes'

const Root = styled.div`
  position: relative;
  //@media (hover: hover) and (pointer: fine) {
  //  &:hover {
  //    .RelatedProducts {
  //      opacity: 1;
  //    }
  //  }
  //}
`
const Title = styled.div`
  ${theme.font.caps06}
  ${theme.size.s('margin-top')}
`
const Lead = styled.div`
  ${theme.font.body02}
  margin-top: 0.5em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`
const Inner = styled.span`
  ${theme.font.lightCaps01}
  display: flex;
  margin-top: 1em;
  align-items: center;
  line-height: 1;
  svg {
    margin-left: 0.5em;
    margin-top: -0.25em;
    width: 15px;
    height: 15px;
  }
`
const TextWrap = styled.div`
  ${mq['md']} {
    padding-right: 7em;
  }
  ${(p) => (p.isFullWidth ? 'width: 50%;' : '')}
`
const LogoWrap = styled.div`
  width: 240px;
  ${theme.size.s('margin-top')}
  ${theme.size.s('margin-bottom')} //height: 50px;
`
const JournalCard = ({
  title,
  image,
  imageMobile,
  imageCard,
  imageCardMobile,
  lead,
  slug,
  link,
  isFullWidth,
  logo
}) => {
  const _sizes = isFullWidth ? ['100vw'] : ['100vw', null, null, '50vw']
  const href = slug ? '/journal/' + slug : link

  let _image = imageCard ?? image
  let _imageMobile = imageCardMobile ?? imageCard ?? imageMobile ?? image

  return (
    <Root>
      <ButtonBlock href={href} target={link ? '_blank' : null}>
        <div className="hide-on-desktop">
          <Image image={_imageMobile} sizes={putImageSizes(_sizes)} />
        </div>
        <div className="hide-on-mobile">
          <Image image={_image} sizes={putImageSizes(_sizes)} />
        </div>
        {logo && (
          <LogoWrap>
            <Image image={logo} />
          </LogoWrap>
        )}
        <TextWrap isFullWidth={isFullWidth}>
          <Title>{title}</Title>
          {lead && <Lead>{lead}</Lead>}
        </TextWrap>
        <Inner>
          Read more
          <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24">
            <rect fill="none" height="24" width="24" />
            <path d="M15,5l-1.41,1.41L18.17,11H2V13h16.17l-4.59,4.59L15,19l7-7L15,5z" />
          </svg>
        </Inner>
      </ButtonBlock>
    </Root>
  )
}

export default JournalCard
