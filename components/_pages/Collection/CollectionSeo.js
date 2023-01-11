import getShopifyImageSrc from '../../../helpers/getShopifyImageSrc'
import { NextSeo } from 'next-seo'
import React from 'react'

const CollectionSeo = ({ fullCollection }) => {
  if (!fullCollection) {
    return null
  }
  return (
    <NextSeo
      {...{
        title: fullCollection.title,
        description: fullCollection.text.replace(/(<([^>]+)>)/gi, ''),
        openGraph: {
          type: 'website',
          locale: 'en_IE',
          url: 'https://www.splits59.com/collections/' + fullCollection.handle,
          description: fullCollection.text !== '' ? fullCollection.text.replace(/(<([^>]+)>)/gi, '') : null,
          site_name: `SPLITS59 Collection`,
          images: fullCollection.image
            ? [
                {
                  url: getShopifyImageSrc({
                    src: fullCollection.image.originalSrc,
                    width: 600,
                    height: 200,
                    crop: 'center'
                  }),
                  width: 600,
                  height: 200
                }
              ]
            : null
        }
      }}
    />
  )
}

export default CollectionSeo
