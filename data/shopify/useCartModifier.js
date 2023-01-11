import { useState, useContext, useEffect } from 'react'
import { StoreContext } from './StoreProvider'
import uuidv4 from '../../helpers/uuidv4'

function useCartModifier(props) {
  const context = useContext(StoreContext)
  const [cartModifierId, setCartModifierId] = useState(null)

  const isProcessing = context.cartModifierProcessing[cartModifierId]
  const isAnyModifierProcessing = !!Object.keys(context.cartModifierProcessing).length

  useEffect(() => {
    if (props?.products) {
      context.setProducts(props.products)
    }
    const uuid = uuidv4()
    setCartModifierId(uuid)
  }, [])

  if (typeof window === 'undefined') {
    return undefined
  }

  return {
    add: (...args) => {
      console.log('useEffect useCartModifier add')

      if (isProcessing) {
        return
      }
      return context.add(...args, cartModifierId)
    },
    remove: (...args) => {
      if (isProcessing) {
        return
      }
      return context.remove(...args, cartModifierId)
    },
    replace: (...args) => {
      console.log('useEffect useCartModifier replace')

      if (isProcessing) {
        return
      }
      return context.replace(...args, cartModifierId)
    },
    isProcessing,
    isAnyModifierProcessing
  }
}

export default useCartModifier
