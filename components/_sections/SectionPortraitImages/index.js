import React, { useRef, useEffect, useState } from 'react'
import { ButtonBlock } from '@button'
import Image from '@image'
import styled from '@emotion/styled'
import { theme, mq } from '@theme'
import Container from '@/components/Container'

const Root = styled.div`
  ${theme.size.xl('margin-top')}
  ${theme.size.xl('margin-bottom')}
`
const MainGrid = styled.div`
  position: relative;
  display: grid;
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`
const InnerGrid = styled.div`
  z-index: 0;
  display: grid;
  ${theme.size.gutter('grid-column-gap')}
  ${theme.size.containerMargin('padding-left')}
// ${theme.size.containerMargin('padding-right')}
grid-auto-columns: 40%;
  grid-auto-flow: column;
  ${mq['lg']} {
    grid-auto-columns: 30%;
  }
  &:after {
    display: block;
    content: '';
    ${theme.size.containerMarginMinusGutter('width')}
  }
`
const TextWrap = styled.div`
  ${theme.size.m('margin-bottom')}
  grid-column: span ${(props) => props.itemsNumber};
  max-width: 600px;
  ${mq['lg']} {
    order: 1;
  }
`
const Title = styled.h2`
  ${theme.font.caps04}
`
const ItemText = styled.div`
  ${theme.font.caps07}
  ${theme.size.xs('margin-top')}
`
const Arrow = styled.button`
  pointer-events: all;
  width: 56px;
  height: 56px;
  border: none;
  cursor: pointer;
  display: ${(p) => (p.hidden ? 'none' : 'flex')};
  align-items: center;
  justify-content: center;
  background: white;
  position: absolute;
  svg {
    transition: opacity 150ms;
  }
  &:hover svg {
    opacity: 0.5;
  }
`
const ScrollWrap = styled.div`
  position: relative;
`
const Controls = styled.div`
  display: none;
  ${mq['lg']} {
    display: flex;
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    align-items: center;
    justify-content: space-between;
  }
`
const Track = styled.div`
  width: 100%;
  height: 2px;
  background: ${theme.colors.mono100};
  position: relative;
  ${theme.size.m('margin-top')}
  ${(p) => (p.items < 2 ? 'display: none;' : 'display: block;')}
${mq['lg']} {
    ${(p) => (p.items < 4 ? 'display: none;' : 'display: block;')}
  }
`
const Indicator = styled.div`
  width: ${(p) => (2 / p.items) * 100}%;
  ${mq['lg']} {
    width: ${(p) => (3 / p.items) * 100}%;
  }
  height: 100%;
  background: ${theme.colors.mono800};
`
const SectionPortraitImages = ({ title, imagesCollection }) => {
  const [isLeftArrowHidden, setLeftArrowHidden] = useState(true)
  const [isRightArrowHidden, setRightArrowHidden] = useState(false)

  const refSlider = useRef(null)
  const refTrack = useRef(null)
  title = 'Title'

  const scrollSlides = (count) => {
    const slide1 = refSlider.current.firstChild.childNodes[0]
    const slide2 = refSlider.current.firstChild.childNodes[1]
    const slideWidth = slide1.getBoundingClientRect().width
    const gutterWidth = slide2.getBoundingClientRect().left - slide1.getBoundingClientRect().right
    const destination = refSlider.current.scrollLeft + count * slideWidth + count * gutterWidth
    refSlider.current.scrollTo({
      left: destination,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    const setupSlider = () => {
      const progress =
        1 -
        (refSlider.current.scrollWidth + refSlider.current.firstChild.getBoundingClientRect().x - window.innerWidth) /
          (refSlider.current.scrollWidth - window.innerWidth)

      if (progress <= 0 && !isLeftArrowHidden) {
        setLeftArrowHidden(true)
      } else {
        setLeftArrowHidden(false)
      }
      if (progress >= 1 && !isRightArrowHidden) {
        setRightArrowHidden(true)
      } else {
        setRightArrowHidden(false)
      }

      const trackWidth = refTrack.current.getBoundingClientRect().width
      const indicatorWidth = refTrack.current.firstChild.getBoundingClientRect().width

      refTrack.current.firstChild.style.transform = `translateX(${progress * (trackWidth - indicatorWidth)}px)`
    }
    const handleSliderScroll = (e) => {
      setupSlider()
    }
    const handleResize = () => {
      setupSlider()
    }
    refSlider.current.addEventListener('scroll', handleSliderScroll)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  return (
    <Root>
      {title && (
        <Container>
          <TextWrap>{title && <Title>{title}</Title>}</TextWrap>
        </Container>
      )}

      <ScrollWrap>
        {imagesCollection.items.length > 3 && (
          <Controls>
            <Arrow onClick={() => scrollSlides(-3)} hidden={isLeftArrowHidden}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                <path d="M0 0h24v24H0V0z" fill="none" opacity=".87" />
                <path d="M17.51 3.87L15.73 2.1 5.84 12l9.9 9.9 1.77-1.77L9.38 12l8.13-8.13z" />
              </svg>
            </Arrow>
            <Arrow onClick={() => scrollSlides(3)} hidden={isRightArrowHidden} style={{ right: 0 }}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                <g>
                  <path d="M0,0h24v24H0V0z" fill="none" />
                </g>
                <g>
                  <polygon points="6.23,20.23 8,22 18,12 8,2 6.23,3.77 14.46,12" />
                </g>
              </svg>
            </Arrow>
          </Controls>
        )}

        <MainGrid ref={refSlider}>
          <InnerGrid itemsNumber={imagesCollection.items.length}>
            {imagesCollection.items.map((item, i) => {
              const _item = (
                <div>
                  <Image image={item.image} sizes={'100vw'} crop={'portrait'} />
                  {item.text && <ItemText>{item.text}</ItemText>}
                </div>
              )

              if (item.href) {
                return (
                  <ButtonBlock href={item.href} key={i}>
                    {_item}
                  </ButtonBlock>
                )
              } else {
                return <div key={i}>{_item}</div>
              }
            })}
          </InnerGrid>
        </MainGrid>
      </ScrollWrap>

      <Container>
        <Track ref={refTrack} items={imagesCollection.items.length}>
          <Indicator items={imagesCollection.items.length} />
        </Track>
      </Container>
    </Root>
  )
}

export default SectionPortraitImages
