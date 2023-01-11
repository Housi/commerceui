import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

const AnalyticsPageContext = React.createContext(null)
const AnalyticsListItemContext = React.createContext(null)

function AnalyticsPageContextProvider({ children, ...restProps }) {
  return <AnalyticsPageContext.Provider value={{ ...restProps }}>{children}</AnalyticsPageContext.Provider>
}
function AnalyticsListItemProvider({ children, list, position }) {
  return <AnalyticsListItemContext.Provider value={{ list, position }}>{children}</AnalyticsListItemContext.Provider>
}

const BRAND = 'SPLITS59'

const logSyle = 'background: #2E495E;border-radius: 0.5em;color: white;font-weight: bold;padding: 2px 0.5em;'

const log = (...args) => {
  console.log('%cuseAnalytics', logSyle, ...args)
}

const getProductIdFromProduct = (product) => {
  console.log(product)
  return atob(product.id).replace('gid://shopify/Product/', '')
}

function useAnalytics() {
  const DEBUG = true

  const pageContext = useContext(AnalyticsPageContext)
  const listItemContext = useContext(AnalyticsListItemContext)
  const router = useRouter()

  useEffect(() => (window.dataLayer = window.dataLayer || []))

  const setCustomerData = (data) => {
    if (DEBUG) {
      log('setCustomerData', data)
    }

    window.dataLayer.push(data)
  }

  const pageView = () => {
    let obj = {
      event: 'virtualPageview',
      pagePath: router.asPath,
      pageTitle: pageContext.pageTitle
    }

    if (pageContext?.pageType) {
      obj = {
        ...obj,
        ...pageContext
      }
    } else {
      obj = {
        ...obj,
        pageType: 'other',
        ecomm_pagetype: 'other'
      }
    }

    if (DEBUG) {
      log('pageView', obj)
    }

    window.dataLayer.push(obj)
  }

  const productImpression = (product) => {
    if (listItemContext === null) {
      log('WARNING: productCard is placed outside of list item context')
    }
    const obj = {
      event: 'productImpression',
      ecomm_prodid: product.variants[0].sku,
      ecomm_pagetype: pageContext.pageType, // Values: home, category, product, cart, purchase, other
      ecomm_totalvalue: product.price.amount,
      content_ids: [getProductIdFromProduct(product)],
      ecommerce: {
        currencyCode: 'USD', // Local currency is optional.
        impressions: [
          {
            name: product.originalTitle, // Name or ID is required.
            id: product.variants[0].sku,
            price: product.price.amount,
            brand: product.vendor ?? BRAND,
            category: product.productType, //
            variant: product.color ?? '', //
            list: listItemContext.list, // List where the event happens: home, category, search, product, related products, cart
            position: listItemContext.position
          }
        ]
      }
    }
    if (DEBUG) log('productImpression', obj)

    window.dataLayer.push(obj)
  }

  const productClick = (product, isFromSearchResults) => {
    if (listItemContext === null) {
      console.warn('WARNING: productClick is placed outside of list item context')
    }

    const obj = {
      event: 'productClick',
      ecomm_prodid: product.variants[0].sku,
      ecomm_pagetype: pageContext.ecomm_pagetype ?? pageContext.pageType, // Values: home, category, product, cart, purchase.
      ecomm_totalvalue: product.price.amount,
      content_ids: [isFromSearchResults ? product.id : getProductIdFromProduct(product)],
      ecommerce: {
        currencyCode: 'USD', // Local currency
        click: {
          actionField: { list: listItemContext.list }, // List where the event happens: home, category, search, product, related products, cart
          products: [
            {
              name: product.originalTitle, // Name or ID is required.
              id: product.variants[0].sku,
              price: product.price.amount,
              brand: product.vendor ?? BRAND,
              category: product.productType, //
              variant: product.color ?? '', // It will be blank or undefined in home, category. Only available when a user selects a variant in product
              position: 1
            }
          ]
        }
      }
    }
    if (DEBUG) log('productClick', obj)
    window.dataLayer.push(obj)
  }

  const productViewDetails = (product) => {
    let obj
    if (product.bundlePieces && product.bundlePieces.length > 0) {
      obj = {
        event: 'productDetailView',
        pageType: 'product',
        ecomm_prodid: product.bundlePieces[0].variants[0].sku,
        ecomm_pagetype: pageContext.pageType, // Values: home, category, product, cart, purchase.
        ecomm_totalvalue: product.bundlePieces
          .reduce((acu, piece) => acu + parseFloat(piece.price.amount), 0)
          .toString(),
        content_ids: product.bundlePieces.map((piece) => getProductIdFromProduct(piece)),
        ecommerce: {
          currencyCode: 'USD', // Local currency
          detail: {
            actionField: { list: 'product' }, // 'detail' actions have an optional list property.
            products: product.bundlePieces.map((p) => ({
              name: p.originalTitle, // Name or ID is required.
              id: p.variants[0].sku,
              price: p.price.amount,
              brand: p.vendor ?? BRAND,
              category: p.productType, //
              variant: p.color ?? ''
            }))
          }
        }
      }
    } else {
      obj = {
        event: 'productDetailView',
        pageType: 'product',
        ecomm_prodid: product.variants[0].sku,
        ecomm_pagetype: 'product', // Values: home, category, product, cart, purchase.
        ecomm_totalvalue: product.price.amount,
        content_ids: [getProductIdFromProduct(product)],
        ecommerce: {
          currencyCode: 'USD', // Local currency
          detail: {
            actionField: { list: 'product' }, // 'detail' actions have an optional list property.
            products: [
              {
                name: product.originalTitle, // Name or ID is required.
                id: product.variants[0].sku,
                price: product.price.amount,
                brand: product.vendor ?? BRAND,
                category: product.productType, //
                variant: product.color ?? ''
              }
            ]
          }
        }
      }
    }

    if (DEBUG) log('productViewDetails', obj)
    window.dataLayer.push(obj)
  }

  const addToCart = (variants, quantity = 1) => {
    variants.forEach((variant) => {
      const obj = {
        event: 'addToCart',
        ecomm_prodid: variant.sku,
        ecomm_pagetype: pageContext.pageType,
        ecomm_totalvalue: variant.product.price.amount,
        content_ids: [getProductIdFromProduct(variant.product)],
        ecommerce: {
          currencyCode: 'USD',
          add: {
            actionField: { list: pageContext.pageType }, // home, category, search, product, related products
            products: [
              {
                name: variant.product.originalTitle, // Name or ID is required.
                id: variant.sku,
                price: variant.product.price.amount,
                brand: variant.product.vendor ?? BRAND,
                category: variant.product.productType, //
                variant: variant.title, //
                quantity: quantity
              }
            ]
          }
        }
      }
      if (DEBUG) log('addToCart', obj)
      window.dataLayer.push(obj)
    })
  }
  const removeFromCart = (variants, quantity = 1) => {
    variants.forEach((variant) => {
      const obj = {
        event: 'removeFromCart',
        content_ids: [getProductIdFromProduct(variant.product)],
        ecommerce: {
          currencyCode: 'USD',
          remove: {
            products: [
              {
                name: variant.product.originalTitle, // Name or ID is required.
                id: variant.sku,
                price: variant.product.price.amount,
                brand: variant.product.vendor,
                category: variant.product.productType,
                variant: variant.title,
                quantity: quantity
              }
            ]
          }
        }
      }
      if (DEBUG) log('removeFromCart', obj)
      window.dataLayer.push(obj)
    })
  }

  const newsletterSignup = () => {
    window.dataLayer.push({
      event: 'newsletter',
      eventCategory: 'newsletter',
      eventAction: 'signup'
    })
  }

  const search = (query) => {
    const obj = {
      event: 'search',
      pageType: pageContext.pageType,
      eventModel: {
        search_term: query
      }
    }

    if (DEBUG) log('search', obj)
    window.dataLayer.push(obj)
  }

  return {
    pageView,
    setCustomerData,
    productImpression,
    productClick,
    productViewDetails,
    addToCart,
    removeFromCart,
    newsletterSignup,
    search
  }
}

export { useAnalytics, AnalyticsPageContextProvider, AnalyticsListItemProvider }
