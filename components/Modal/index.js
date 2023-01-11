import React, { useState } from 'react'

import Button from '@button'
import Modal from 'react-modal'

import { theme } from '@theme'
import { Global, css } from '@emotion/react'
import styled from '@emotion/styled'
import IconClose from '@/components/_icons/IconClose'

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${theme.size.s('padding')}
  ${theme.size.menuBarHeight('height')}
  ${(p) =>
    p.placement === 'right'
      ? `border-bottom: 1px solid ${theme.colors.mono100};`
      : `${theme.size.containerWideMargin('padding-left')}`}
`
const Title = styled.h1`
  ${theme.font.caps06}
`
const Inner = styled.div`
  position: relative;
  overflow-y: auto;
`
const CloseButtonInner = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 0.5em;
  align-items: center;
`

const SplitsModal = ({
  isOpen,
  onRequestClose,
  closeTimeoutMS,
  children,
  title,
  isWide,
  footer,
  placement = 'right',
  mobilePlacement = 'right'
}) => {
  const [wasOpen, setWasOpen] = useState(false)

  function afterOpenModal() {
    setTimeout(() => {
      setWasOpen(true)
    }, 0)
  }

  function afterClose() {
    setTimeout(() => {
      setWasOpen(false)
    }, 0)
  }
  return (
    <>
      <Global
        styles={css`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            transition: background ${theme.timing.modalAnimation}ms;
            z-index: 10;
            background: rgba(0, 0, 0, 0);
          }
          .modal-overlay-after-open {
            background: rgba(0, 0, 0, 0.5);
          }
          .modal-overlay-before-close {
            background: rgba(0, 0, 0, 0);
          }
          .modal-content {
            position: absolute;
            background: white;
            width: 100%;
            top: 0;
            height: 100%;
            display: grid;
            grid-template-rows: auto 1fr auto;
            transition: transform ${closeTimeoutMS ?? theme.timing.modalAnimation}ms;
            max-width: 450px;
            &:focus {
              outline: none;
            }
          }
          .modal-content-wide {
            max-width: 600px;
          }
          .modal-content-right {
            right: 0;
            &.modal-content-after-open {
              transform: none;
            }
            &,
            &.modal-content-before-close {
              transform: translateX(100%);
            }
          }
          .modal-content-left {
            left: 0;
            &.modal-content-after-open {
              transform: none;
            }
            &,
            &.modal-content-before-close {
              transform: translateX(-100%);
            }
          }
          @media (max-width: 419px) {
            .modal-content-mobile-bottom {
              bottom: 0;
              top: auto;
              height: calc(100% - 70px);
              max-width: none;
              &.modal-content-after-open {
                transform: none;
              }
              &,
              &.modal-content-before-close {
                transform: translateY(100%);
              }
            }
          }
        `}
      />

      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        closeTimeoutMS={closeTimeoutMS ?? theme.timing.modalAnimation}
        overlayClassName={{
          base: 'modal-overlay',
          afterOpen: wasOpen ? 'modal-overlay-after-open' : '',
          beforeClose: 'modal-overlay-before-close'
        }}
        className={{
          base: `modal-content ${
            isWide ? 'modal-content-wide' : ''
          } modal-content-${placement} modal-content-mobile-${mobilePlacement}`,
          afterOpen: wasOpen ? 'modal-content-after-open' : '',
          beforeClose: 'modal-content-before-close'
        }}
        onAfterOpen={afterOpenModal}
        onAfterClose={afterClose}
      >
        <Header placement={placement}>
          {title && <Title>{title}</Title>}
          <Button onClick={onRequestClose}>
            <CloseButtonInner>
              <span style={{ order: placement === 'left' && 1 }}>Close</span>
              <IconClose />
            </CloseButtonInner>
          </Button>
        </Header>
        <Inner>{children}</Inner>
        {footer && footer}
      </Modal>
    </>
  )
}

// putLineItemsQuantity(cart.lineItems)

export default SplitsModal
