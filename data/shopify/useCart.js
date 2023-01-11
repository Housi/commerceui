import { useContext } from 'react'
import { StoreContext } from './StoreProvider'

function useCart() {
  const context = useContext(StoreContext)

  if (typeof window === 'undefined') {
    return undefined;
  }

  return context.cart;
}

export default useCart;
