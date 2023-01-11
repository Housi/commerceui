import React, { useEffect, useRef } from 'react'
import Image from '@image'
import putImageSizes from '@/helpers/putImageSizes'
import styled from '@emotion/styled'
import { theme, mq, rs } from '@theme'
import IconReturns from '@/components/_icons/IconReturns'
import IconShipping from '@/components/_icons/IconShipping'
import { ButtonRaw } from '@button'

const GalleryBoxStyled = styled.div`
  display: grid;
  grid-auto-columns: 100%;
  grid-auto-flow: column;
  overflow-x: scroll;
  overflow-y: hidden;
  max-height: 80vh;
  scroll-snap-type: x mandatory;
  ${mq['lg']} {
    grid-auto-columns: unset;
    grid-auto-flow: unset;
    overflow-x: visible;
    overflow-y: visible;
    max-height: none;
    scroll-snap-type: unset;
    ${(props) =>
      props.isBundle
        ? `
  grid-template-columns: 1fr 1fr;`
        : ``}
  }
`

const GalleryItem = styled.div`
  scroll-snap-align: start;
`

const ExtraBox = styled.div`
  height: 140px;
  grid-template-columns: 1fr 1fr;
  align-content: center;
  display: none;
  ${mq['md']} {
    display: grid;
  }
  a {
    text-align: center;
  }
  h3 {
    ${theme.font.caps06}
  }
  p {
    ${theme.font.lightCaps01}
  }
  svg {
    width: 44px;
    height: 44px;
  }
`
const ProductGallery = ({ media, isBundle }) => {
  const refRoot = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      // windowH = window.innerHeight;
      // windowW = window.innerWidth;
    }

    const handleScroll = () => {
      // if (windowW <= breakpoint) {
      //   return
      // }
      // let windowY = window.scrollY;
      // // console.log(windowY , galleryItems[1].offsetTop, galleryItems[1].offsetHeight)
      // galleryItems.forEach((item, i) => {
      //
      //   let scrollDetector = windowY + windowH/2
      //
      //   if ( scrollDetector > item.offsetTop
      //     && scrollDetector <= item.offsetTop + item.offsetHeight
      //     && currentItemIndex !== i ) {
      //       setCurrentItemIndex(i);
      //   }
      // });
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  })

  return (
    <GalleryBoxStyled ref={refRoot} isBundle={isBundle}>
      {media &&
        media.map((item, i) => (
          <GalleryItem key={item.id} className={'GalleryItem'}>
            {item.type === 'IMAGE' && (
              <Image
                image={item}
                sizes={putImageSizes(['100vw', null, isBundle ? '30vw' : '70vw'])}
                priority={i === 0}
              />
            )}
            {!isBundle && i === 1 && (
              <ExtraBox>
                <ButtonRaw href={'/shipping-and-returns'}>
                  <IconShipping />
                  <h3>Free shipping</h3>
                  <p>For all US orders. Learn more </p>
                </ButtonRaw>
                <ButtonRaw href={'/shipping-and-returns'}>
                  <IconReturns />
                  <h3>Easy returns</h3>
                  <p>Learn more</p>
                </ButtonRaw>
              </ExtraBox>
            )}
          </GalleryItem>
        ))}
    </GalleryBoxStyled>
  )
}

export default ProductGallery
