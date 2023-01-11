import React, { useState, useRef } from 'react'
import NextImage from 'next/image'

import styled from '@emotion/styled'
import { theme } from '@theme'
import getShopifyImageSrc from '@/helpers/getShopifyImageSrc'

import ImgixClient from '@imgix/js-core'

const client = new ImgixClient({
  domain: 'splits59.imgix.net',
  secureURLToken: 'HdRnRp2sSESFs6jF'
})

const VARIANTS = {
  natural: 0.71,
  square: 1,
  landscape: 1.4,
  panoramic: 2.5,
  portrait: 1.52,
  product: 1.52
}

const Root = styled.div`
  position: relative;

  background: ${(props) => props.backgroundColor ?? theme.colors.mono50};
  ${(props) => (props.ratio ? `padding-bottom: ${props.ratio * 100}%;` : '')}
  ${(props) => (props.inset ? `width: 100%; height: 100%;` : '')}
& > div {
    ${(props) => (props.disableTransition ? `` : `transition: opacity 200ms 17ms;`)}
    ${(props) => (props.loaded ? '' : 'opacity: 0;')}
  }
`

const Image = ({ onLoad, ...props }) => {
  const [loaded, setLoaded] = useState(!!props.priority)
  const refRoot = useRef(null)

  if (props.image === null) {
    return <pre style={{ textAlign: 'center' }}>No image</pre>
  }

  if (props.image.contentType === 'text/html') {
    return <pre style={{ textAlign: 'center' }}>Incorrect media type</pre>
  }

  const onLoadCallback = () => {
    if (refRoot.current.querySelector('img').complete) setLoaded(true)
  }

  let _nextImageProps

  let _ratio
  let _inset = props.layout === 'fill'

  if (props.image.from === 'shopify') {
    _ratio = VARIANTS.product

    _nextImageProps = {
      src: props.image.originalSrc,
      sizes: props.sizes ?? '100vw',
      alt: props.image.altText ?? null,
      layout: 'fill',
      objectFit: 'cover',
      loader: ({ src, width }) => getShopifyImageSrc({ src, width })
    }
  } else {
    if (props.crop && VARIANTS[props.crop]) {
      // soft crop
      _ratio = 1 / VARIANTS[props.crop]
      props.layout = 'fill'
    }

    _nextImageProps = {
      src: props.image.src,
      width: props.layout === 'fill' ? null : props.image.width,
      height: props.layout === 'fill' ? null : props.image.height,
      sizes: props.sizes ?? '100vw',
      alt: props.image.title ?? null,
      layout: props.layout ?? null,
      objectFit: props.objectFit ?? (props.layout === 'fill' ? 'cover' : null),
      loader: ({ src, width }) =>
        client.buildURL(src, {
          w: width,
          auto: 'format'
          // h: props.layout === "fill" ? null : Math.round((props.image.height/props.image.width) * width )
        })
    }
  }
  return (
    <Root
      loaded={loaded}
      ratio={_ratio}
      inset={_inset}
      backgroundColor={props.backgroundColor}
      ref={refRoot}
      disableTransition={props.disableTransition}
    >
      <NextImage onLoad={onLoadCallback} {..._nextImageProps} priority={props.priority} />
    </Root>
  )
}

export default Image
