import { createContext, useState, useEffect, useCallback, useRef } from 'react'
import { fetchOrCreateCheckout, replaceLineItems } from './services/checkoutService'
import { getIdFromLineItem, restoreOrder } from './restoreOrder'

const mapCartLineItems = (item) => ({
  variantId: item.variant.id,
  quantity: item.quantity,
  customAttributes: item.customAttributes?.map((a) => ({
    key: a.key,
    value: a.value
  }))
})

const merge = (target, source) => {
  // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object) Object.assign(source[key], merge(target[key], source[key]))
  }

  // Join `target` and modified `source`
  Object.assign(target || {}, source)
  return target
}

export const StoreContext = createContext({})
const { Provider } = StoreContext

function StoreProvider(props) {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState(undefined)
  const [isProcessing, setIsProcessing] = useState(false)
  const [cartModifierProcessing, setCartModifierProcessing] = useState({})
  let abortController = useRef(null)

  useEffect(() => {
    abortController.current = new AbortController()
  }, [])

  useEffect(() => {
    readCart()
    window.addEventListener('focus', readCart)
    return () => window.removeEventListener('focus', readCart)
  }, [])

  // useEffect(() => {
  //   console.log('useEffect StoreProvider', isProcessing)
  // })

  const finalCart = cart === undefined ? undefined : cart?.lineItems?.length > 0 ? { ...cart, isProcessing } : null

  const readCart = useCallback(() => {
    fetchOrCreateCheckout(false).then(async (initialCart) => {
      if (initialCart === null) {
        setCart(null)
        return
      }
      const newLineItems = initialCart.lineItems
        .map((lineItem) => {
          let quantity = lineItem.quantity

          if (lineItem.variant.quantityAvailable >= 0) {
            if (lineItem.variant.quantityAvailable > 0) {
              if (lineItem.quantity < lineItem.variant.quantityAvailable) {
                quantity = lineItem.quantity
              } else {
                quantity = lineItem.variant.quantityAvailable
              }
            } else if (!lineItem.variant.currentlyNotInStock) {
              quantity = 0
            }
          }

          return {
            ...lineItem,
            quantity
          }
        })
        .filter((item) => item.quantity !== 0)

      const newCart = await reloadCart(newLineItems)

      setCart(newCart)
    })
  }, [])

  const reloadCart = useCallback(
    async (currentlineItems) => {
      // console.log("___ reloadCart ___");
      // _log(currentlineItems, "old");
      if (abortController.current && isProcessing) {
        abortController.current.abort()
      }
      abortController.current = new AbortController()
      setIsProcessing(true)

      const newCart = await replaceLineItems(currentlineItems.map(mapCartLineItems), abortController.current.signal)
      if (!newCart) {
        return
      }

      const sortedCart = {
        ...newCart,
        lineItems: restoreOrder(currentlineItems, newCart.lineItems)
      }

      setIsProcessing(false)

      return sortedCart
    },
    [isProcessing, cartModifierProcessing]
  )

  const add = useCallback(
    async (productVariants, customAttributes = [], cartModifierId) => {
      // console.log('@add', productVariants, cart)
      const quantity = 1

      // await console.log("add, productVariants", productVariants)

      // let t1 = new Date();

      // console.log('@add 2', lineItems)

      let isPartiallyUpdated = false

      function checkQuantityAfterAdd(lineItems) {
        return lineItems
          .map((lineItem) => {
            let quantity = lineItem.quantity

            // const variant = {
            //   ...lineItem.variant,
            //   product:
            //     lineItem.variant.product ||
            //     products.find(p => p.id === lineItem.variant.productId) ||
            //     oldCart.lineItems.find(item =>
            //       item.variant.id === lineItem.variant.id || item.variant.productId === lineItem.variant.productId
            //     )?.product
            // }
            //
            if (lineItem.variant.quantityAvailable >= 0) {
              if (lineItem.variant.quantityAvailable > 0) {
                if (lineItem.quantity > lineItem.variant.quantityAvailable) {
                  isPartiallyUpdated = true
                  quantity = lineItem.variant.quantityAvailable
                }
              } else if (!lineItem.variant.currentlyNotInStock) {
                console.log("This variant is not available in stock, can't add this product to cart")
                isPartiallyUpdated = true
                quantity = 0
              }
            }

            return {
              ...lineItem,
              // variant,
              quantity
            }
          })
          .filter((item) => item.quantity !== 0)
      }

      // fallback
      const oldCart = cart ? { ...cart } : undefined

      try {
        setIsProcessing(true)
        setCartModifierProcessing({
          ...cartModifierProcessing,
          [cartModifierId]: true
        })
        // Optimistic cart update
        let lineItems = cart ? [...cart.lineItems] : []

        let requestedQuantity = 1

        if (productVariants.length === 1) {
          // single variant add

          const productVariant = productVariants[0]
          const foundItem = lineItems.find(
            (lineItem) =>
              lineItem.variant.id === productVariant.id && lineItem.customAttributes.length === customAttributes.length
          )
          // console.log("@@@foundItem", foundItem)
          if (foundItem) {
            // item already found in cart
            lineItems = lineItems.map((lineItem) => {
              let newQuantity = lineItem.quantity

              if (
                lineItem.variant.selectedOptions[0].value === productVariant.selectedOptions[0].value &&
                lineItem.variant.sku === productVariant.sku
              ) {
                newQuantity = lineItem.quantity + quantity
              }

              requestedQuantity = newQuantity
              return {
                ...lineItem,
                quantity: newQuantity
              }
            })
          } else {
            // new item in cart
            lineItems = [
              {
                variant: {
                  ...productVariant,
                  product: products.find((p) => p.id === productVariant.productId)
                },
                quantity: 1,
                customAttributes: customAttributes
              },
              ...lineItems
            ]
          }
          // console.log("@add 2.5", lineItems)
        } else {
          // bundle
          let newLineItems = productVariants.map((productVariant) => {
            return {
              variant: {
                ...productVariant,
                product: products.find((p) => p.id === productVariant.productId)
              },
              quantity: 1,
              customAttributes: customAttributes
            }
          })

          lineItems = [...newLineItems, ...lineItems]
        }

        lineItems = checkQuantityAfterAdd(lineItems)

        if (cart) {
          setCart({
            ...cart,
            lineItems
          })
        } else {
          setCart({
            lineItems,
            subtotalPrice: {
              amount: '0.0',
              currencyCode: null
            },
            totalPrice: {
              amount: '0.0',
              currencyCode: null
            },
            shippingPrice: null, // nullable! if shippingMethod was not picked in current session, then it's null
            currencyCode: null,
            checkoutUrl: null // url to Shopify checkout
          })
        }
        // First add
        await fetchOrCreateCheckout(true)

        // Confirm and reload on Shopify

        let newCart = await reloadCart(lineItems)

        // console.log('@add 3', newCart)

        if (newCart.lineItems.some((lineItem) => lineItem.quantity > lineItem.variant.quantityAvailable)) {
          const newLineItems = checkQuantityAfterAdd(newCart.lineItems)
          newCart = await reloadCart(newLineItems)
        }

        setCart(newCart)

        const itemsToReturn = newCart ? newCart.lineItems : lineItems
        let variantsToReturn = []

        productVariants.forEach((variant) => {
          variantsToReturn.push(itemsToReturn.find((item) => item.variant.id === variant.id))
        })

        setCartModifierProcessing({})
        // let t2 = new Date();
        // console.log(`add total time: ${t2 - t1}ms`)
        return {
          variants: variantsToReturn?.map((v) => v.variant),
          // quantity: variantToReturn?.quantity ?? 0,
          cart: newCart,
          isPartiallyUpdated,
          requestedQuantity
        }
      } catch (err) {
        console.log(err)
        setCart(oldCart)
        setIsProcessing(false)
        setCartModifierProcessing({})
      }
    },
    [cart, products]
  )

  const remove = useCallback(
    async (lineItemId, cartModifierId) => {
      // Fallback to old cart
      const oldCart = { ...cart }
      try {
        // Optimistic cart update
        setCartModifierProcessing({
          ...cartModifierProcessing,
          [cartModifierId]: true
        })
        const localLineItems = cart.lineItems.filter((item) => item.id !== lineItemId)
        setCart({
          ...cart,
          lineItems: localLineItems
        })

        // Confirm and reload on Shopify
        const newCart = await reloadCart(localLineItems)
        setCart(newCart)

        setCartModifierProcessing({})
        return {
          cart: newCart
          // variant: productVariant,
        }
      } catch (err) {
        console.log(err)
        setCart(oldCart)
        setIsProcessing(false)
        setCartModifierProcessing({})
      }
    },
    [cart]
  )

  const replace = useCallback(
    async (lineItems, cartModifierId) => {
      // console.log("#replace")
      let lineItemsPartiallyUpdated = []
      let isPartiallyUpdated = false
      // let t1 = new Date();

      function checkQuantityAfterReplace(lineItems) {
        return lineItems
          .map((lineItem) => {
            let quantity = lineItem.quantity

            const variant = {
              ...lineItem.variant,
              product:
                lineItem.variant.product ||
                products.find((p) => p.id === lineItem.variant.productId) ||
                oldCart.lineItems.find(
                  (item) =>
                    item.variant.id === lineItem.variant.id || item.variant.productId === lineItem.variant.productId
                )?.product
            }
            if (
              lineItem.variant.quantityAvailable >= 0 &&
              lineItem.quantity > lineItem.variant.quantityAvailable &&
              !lineItem.variant.currentlyNotInStock
            ) {
              isPartiallyUpdated = true
              quantity = lineItem.variant.quantityAvailable

              lineItemsPartiallyUpdated.push({
                variant,
                quantity,
                requestedQuantity: lineItem.quantity
              })
            }
            return {
              ...lineItem,
              variant,
              quantity
            }
          })
          .filter((item) => item.quantity !== 0)
      }

      // Fallback to old cart
      const oldCart = { ...cart }
      try {
        setCartModifierProcessing({
          ...cartModifierProcessing,
          [cartModifierId]: true
        })
        // Optimistic cart update
        let newLineItems = lineItems
          .map((item) => ({
            ...item,
            id: getIdFromLineItem(item)
          }))
          .reduce((lineItems, item) => {
            let newItem = { ...item }
            if (
              lineItems.some(
                (lineItem) => lineItem.variant.id === item.variant.id && item.customAttributes?.length === 0
              )
            ) {
              return lineItems.map((lineItem) => ({
                ...lineItem,
                quantity: lineItem.quantity + item.quantity
              }))
            }
            return [...lineItems, newItem]
          }, [])

        newLineItems = checkQuantityAfterReplace(newLineItems)

        setCart({
          ...cart,
          lineItems: newLineItems
        })

        // Confirm and reload on Shopify
        let newCart = await reloadCart(newLineItems)

        if (newCart.lineItems.some((lineItem) => lineItem.quantity > lineItem.variant.quantityAvailable)) {
          const newLineItems = checkQuantityAfterReplace(newCart.lineItems)
          newCart = await reloadCart(newLineItems)
        }
        setCart(newCart)
        setCartModifierProcessing({})

        // let t2 = new Date();
        // console.log(`replace total time: ${t2 - t1}ms`)

        return {
          cart: newCart,
          isPartiallyUpdated,
          lineItemsPartiallyUpdated
        }
      } catch (err) {
        console.log(err)
        setCart(oldCart)
        setIsProcessing(false)
        setCartModifierProcessing({})
      }
    },
    [cart, products]
  )

  return (
    <Provider
      {...props}
      value={{
        cart: finalCart,
        setProducts,
        cartModifierProcessing,
        add,
        remove,
        replace
      }}
    />
  )
}

export default StoreProvider
