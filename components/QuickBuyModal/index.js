import React from 'react'
import styled from '@emotion/styled'
import { theme } from '@theme'
import SplitsModal from '@/components/Modal'
import ProductDetails from '@/components/ProductDetails'

const ModalInner = styled.div`
  ${theme.size.s('padding')}
  display: grid;
  ${theme.size.s('grid-row-gap')}
`

const QuickBuyModal = ({ isOpen, product, onRequestClose }) => {
  return (
    <SplitsModal isOpen={isOpen} onRequestClose={onRequestClose} title={'Quickbuy'} mobilePlacement={'bottom'}>
      <ModalInner>
        <ProductDetails product={product} callbackOnAdd={onRequestClose} isInQuickBuy />
      </ModalInner>
    </SplitsModal>
  )
}

export default QuickBuyModal
