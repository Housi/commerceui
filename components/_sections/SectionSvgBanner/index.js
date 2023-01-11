import React from 'react'
import Image from '@image'
import styled from '@emotion/styled'
import { theme, mq } from '@theme'

import { ButtonBlock, ButtonColor } from '@button'
import MuxVideo from '@/components/MuxVideo'

const Root = styled.div`
  position: relative;
  ${(p) =>
    p.isFullBleed
      ? ``
      : `
${theme.size.containerMargin('padding-left')}
${theme.size.containerMargin('padding-right')}
`}
`

const Inner = styled.div`
  position: relative;
`

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`
const ButtonWrapper = styled.div`
  position: absolute;
  top: ${(p) => p.topMobile ?? '50'}%;
  left: ${(p) => p.leftMobile ?? '50'}%;
  display: flex;
  align-items: center;
  justify-content: center;
  ${mq['lg']} {
    top: ${(p) => p.top ?? '50'}%;
    left: ${(p) => p.left ?? '50'}%;
  }
`

const ButtonWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  ${theme.size.containerMargin('left')}
  ${theme.size.containerMargin('right')}
${theme.size.l('top')}
${theme.size.l('bottom')}
`

const SectionSvgBanner = ({
  background,
  backgroundMobile,
  buttonLabel,
  buttonHref,
  contentColor,
  contentColorMobile,
  contentImage,
  contentImageMobile,
  buttonTop,
  buttonLeft,
  buttonTopMobile,
  buttonLeftMobile,
  priority,
  isHalfOnDesktop,
  isFullBleed
}) => {
  const buttonElem = buttonHref && buttonLabel && (
    <ButtonWrapper top={buttonTop} left={buttonLeft} topMobile={buttonTopMobile} leftMobile={buttonLeftMobile}>
      <div style={{ position: 'absolute' }}>
        <ButtonColor
          href={buttonHref}
          color={contentColor}
          colorMobile={contentColorMobile}
          style={{ pointerEvents: 'all' }}
        >
          {buttonLabel}
        </ButtonColor>
      </div>
    </ButtonWrapper>
  )

  return (
    <Root isFullBleed={isFullBleed !== false}>
      <Inner>
        <ButtonBlock href={buttonHref} tabIndex={-1}>
          {background ? (
            <div className={backgroundMobile ? 'hide-on-mobile' : null}>
              {background.image && (
                <Image image={background.image} sizes={isHalfOnDesktop ? '50vw' : '100vw'} priority={priority} />
              )}
              {background.video && <MuxVideo file={background.video} />}
            </div>
          ) : (
            <pre
              style={{
                background: 'grey',
                color: 'white',
                height: '100vh',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed #333'
              }}
            >
              section has no background
            </pre>
          )}

          {backgroundMobile && (
            <div className={'hide-on-desktop'}>
              {backgroundMobile.image && <Image image={backgroundMobile.image} sizes={'100vw'} priority={priority} />}
              {backgroundMobile.video && <MuxVideo file={backgroundMobile.video} />}
            </div>
          )}
        </ButtonBlock>

        <Overlay>
          {contentImage && (
            <>
              <img
                src={contentImage.src}
                width={contentImage.width}
                height={contentImage.height}
                alt={contentImage.title}
                className={contentImageMobile ? 'hide-on-mobile' : null}
              />
              {contentImageMobile && (
                <img
                  src={contentImageMobile.src}
                  width={contentImageMobile.width}
                  height={contentImageMobile.height}
                  alt={contentImage.title}
                  className={'hide-on-desktop'}
                />
              )}
            </>
          )}

          <ButtonWrap>{buttonElem}</ButtonWrap>
        </Overlay>
      </Inner>
    </Root>
  )
}

export default SectionSvgBanner
