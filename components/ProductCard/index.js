import React, { useEffect, useRef, useState } from 'react'
import { ButtonBlock } from '@button'
import Image from '@image'
import styled from '@emotion/styled'
import { theme, mq, rs } from '@theme'

import putImageSizes from '../../helpers/putImageSizes'
import ProductPrice from '../ProductPrice'
import { ButtonRaw } from '@button'
import SwtachDot from '../SwatchDot'

import getBadgesFromProductTags from '../../helpers/getBadgesFromProductTags'
import { useSettings } from '@/hooks/Settings'
import { useAnalytics } from '@/hooks/Analytics'
import QuickBuyModal from '@/components/QuickBuyModal'
import IconQuickBuy from '@/components/_icons/IconQuickBuy'

const PriceWrapper = styled.div`
  ${rs('display', ['block', null, 'inline'])}
`
const Separator = styled.div`
  ${rs('display', ['none', null, 'inline'])}
`
const ProductTitle = styled.div`
  ${theme.font.caps07}
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  & > * {
    margin-right: 0.25em;
  }
  s {
    color: ${theme.colors.mono500};
  }
  .final-sale {
    color: ${theme.colors.red};
    ${theme.font.body03}
    height: 100%;
    display: inline-flex;
    align-items: center;
    margin-top: 0.05em;
  }
`
const RelatedProducts = styled.div`
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  align-items: center;
  grid-column-gap: 4px;
  margin-top: 2px;
  opacity: ${(p) => (p.isVisible ? '1' : '0')};
  transition: opacity 200ms;
  display: none;
  ${mq['md']} {
    display: inline-grid;
  }
  span {
    ${theme.font.lightCaps01}
  }
`

const TextWrap = styled.div`
  display: grid;
  justify-content: space-between;
`
const ImageWrap = styled.div`
  position: relative;
  width: 100%;
  ${theme.size.xs('margin-bottom')}
`

const Root = styled.div`
  position: relative;
`
const SecondaryImage = styled.div`
  position: absolute;
  transition: opacity 200ms;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: ${(p) => (p.isVisible ? '1' : '0')};
`

const Badge = styled.div`
  display: inline;
  float: left;
  ${theme.font.caps07}
  background: black;
  color: white;
  padding: 1px 3px;
  white-space: nowrap;
`
const BadgesInner = styled.div`
  position: absolute;
  display: inline-flex;
  gap: 4px;
  padding: 10px 10px;
  grid-auto-flow: column;
  ${mq['lg']} {
    position: relative;
  }
`
const BadgesWrap = styled.div`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  -webkit-mask-image: -webkit-gradient(linear, 60% top, 98% top, from(rgba(0, 0, 0, 1)), to(rgba(0, 0, 0, 0)));
`

const QuickBuyButton = styled.button`
  appearance: none;
  border: 0;
  width: 44px;
  height: 44px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  bottom: 10px;
  right: 10px;
  z-index: 1;
  box-shadow: 0 0px 10px 0 rgba(0, 0, 0, 0.1);
  transition: all 150ms;
  cursor: pointer;
  ${(p) => (p.isActive ? `background: ${theme.colors.mono200}; color: ${theme.colors.mono700};` : ``)}
  svg {
    width: 24px;
  }
  @media (hover: hover) and (pointer: fine) {
    opacity: ${(p) => (p.isVisible ? '1' : '0')};
  }
`

const ProductCard = ({ product, isHalfOnDesktop, preload, collectionHandle }) => {
  const [currentProduct, setCurrentProduct] = useState(product)
  const [isQuickBuyOpen, setQuickBuyOpen] = useState(false)
  const [isHovered, setHovered] = useState(false)
  const { productColors } = useSettings()

  const Analytics = useAnalytics()
  const refObserverContainer = useRef(null)

  const hasBeenViewed = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(callbackObserverFunction, options)
    if (refObserverContainer.current) observer.observe(refObserverContainer.current)

    return () => {
      if (refObserverContainer.current) observer.unobserve(refObserverContainer.current)
    }
  }, [refObserverContainer])

  if (!product) {
    return null
  }

  const isBundle = product.bundlePieces?.length > 1

  const _sizes = putImageSizes(['100vw', null, '50vw', isHalfOnDesktop ? '50vw' : '33vw'])

  const relatedProducts = product.relatedProducts

  const badges = getBadgesFromProductTags(product.tags)

  if (product.bundleMessage) {
    badges.push(product.bundleMessage)
  }

  let primaryImage = currentProduct.primaryImage

  if (currentProduct.featuredImageCollections) {
    let displayFeaturedImage = currentProduct.featuredImageCollections?.includes(collectionHandle)
    if (displayFeaturedImage) {
      primaryImage = displayFeaturedImage
        ? currentProduct.featuredImage ?? currentProduct.primaryImage
        : currentProduct.primaryImage
    }
  }
  const callbackObserverFunction = (entries) => {
    if (hasBeenViewed.current) {
      return
    }
    const [entry] = entries
    if (entry.isIntersecting) {
      Analytics.productImpression(product)
      hasBeenViewed.current = true
    }
  }
  const options = {
    root: null,
    threshold: 1.0
  }

  return (
    <Root
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseOver={() => setHovered(true)}
    >
      <ImageWrap>
        <ButtonBlock
          href={`/products/${currentProduct.handle}`}
          onClick={() => Analytics.productClick(currentProduct)}
          tabIndex={-1}
        >
          <Image image={primaryImage} sizes={_sizes} priority={preload} />
          {currentProduct.secondaryImage && (
            <SecondaryImage isVisible={isHovered}>
              <Image image={currentProduct.secondaryImage} sizes={_sizes} backgroundColor={'transparent'} />
            </SecondaryImage>
          )}
          {badges.length > 0 && (
            <BadgesWrap>
              <BadgesInner>
                {badges.map((badge, i) => {
                  return <Badge key={i}>{badge}</Badge>
                })}
              </BadgesInner>
            </BadgesWrap>
          )}
        </ButtonBlock>
        {!isBundle && (
          <QuickBuyButton isVisible={isHovered} onClick={() => setQuickBuyOpen(true)} isActive={isQuickBuyOpen}>
            <div className="sr-only">Open quickbuy modal</div>
            <IconQuickBuy />
          </QuickBuyButton>
        )}
      </ImageWrap>

      <ButtonBlock href={`/products/${currentProduct.handle}`} onClick={() => Analytics.productClick(currentProduct)}>
        <TextWrap ref={refObserverContainer}>
          <ProductTitle>
            <span>{product.title}</span>
            <Separator>-</Separator>
            <PriceWrapper>
              <ProductPrice price={currentProduct.price} compareAtPrice={currentProduct.compareAtPrice} />
            </PriceWrapper>
            {product.tags.includes('final-sale') && <span className={'final-sale'}>Final Sale</span>}
          </ProductTitle>
        </TextWrap>
      </ButtonBlock>

      {relatedProducts && (
        <RelatedProducts isVisible={isHovered}>
          {relatedProducts.length > 1 &&
            relatedProducts.map((p, i) => {
              if (i < 5) {
                return (
                  <ButtonRaw onClick={() => setCurrentProduct(p)} tabIndex={-1} key={i}>
                    <SwtachDot
                      isCurrent={currentProduct.color === p.color}
                      isSmall
                      swatchMap={productColors}
                      swatchName={p.color}
                    />
                  </ButtonRaw>
                )
              }
            })}
          {relatedProducts.length > 5 && (
            <ButtonBlock href={`/products/${currentProduct.handle}`} tabIndex={-1}>
              <span>+{relatedProducts.length - 5}</span>
            </ButtonBlock>
          )}
        </RelatedProducts>
      )}

      <QuickBuyModal
        product={currentProduct}
        isOpen={isQuickBuyOpen}
        onRequestClose={() => {
          setQuickBuyOpen(false)
          setHovered(false)
        }}
      />
    </Root>
  )
}

export default ProductCard
