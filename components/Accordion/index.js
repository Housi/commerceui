import React, { useState, useRef, useEffect } from 'react'
import styled from '@emotion/styled'
import Button, { ButtonBlock } from '@button'
import { theme } from '@theme'
import IconMinus from '@/components/_icons/IconMinus'
import IconPlus from '@/components/_icons/IconPlus'

const animationTime = 200

const AccordionRoot = styled.div`
  position: relative;
  border-bottom: 1px solid ${theme.colors.mono100};
  ${(props) => (props.hasTopBorder ? `border-top: 1px solid ${theme.colors.mono100};` : ``)}
`
const AccordionBody = styled.div`
  overflow: hidden;
  position: relative;
  transition: height ${animationTime}ms ${theme.ease.quadOut};
  ${(props) =>
    props.isOpen
      ? `
`
      : `
height: 0;
`};
  ${(props) => (props.isLocked ? `visibility: hidden;` : ``)};
`

const AccordionBodyInner = styled.div`
  transition: opacity ${animationTime / 2}ms;
  ${(props) =>
    props.isOpen
      ? `
transition-delay: opacity ${animationTime}ms;
opacity: 1;
`
      : `
opacity: 0;
`}
  ${theme.size.s('padding')}
padding-top: 4px !important;
  ${(props) => (props.hasSidePaddings ? `` : `padding-right: 0 !important; padding-left: 0 !important;`)}
`
const ButtonInner = styled.div`
  display: flex;
  align-items: center;
  text-align: left;
  justify-content: space-between;
  ${theme.font.caps07}
  min-height: 60px;
  ${theme.size.s('padding')}
  ${(props) => (props.hasSidePaddings ? `` : `padding-right: 0 !important; padding-left: 0 !important;`)}
svg {
    width: 16px;
    height: 16px;
  }
`

const Accordion = ({ title, children, hasSidePaddings, hasTopBorder, isOpenAtStart = false }) => {
  const [isOpen, setOpen] = useState(isOpenAtStart)
  const [isLocked, setLocked] = useState(true)
  const refBody = useRef(null)
  const lockTimeout = useRef(null)

  const setBodyHeight = () => {
    refBody.current.style.height = refBody.current.firstChild.getBoundingClientRect().height + 'px'
  }

  const open = () => {
    clearTimeout(lockTimeout.current)
    setBodyHeight()
    setOpen(true)
    setLocked(false)
  }

  const close = () => {
    refBody.current.style.height = 0
    setOpen(false)
    lockTimeout.current = setTimeout(() => {
      setLocked(true)
    }, animationTime)
  }

  useEffect(() => {
    if (isOpen) {
      open()
    }
  })

  return (
    <AccordionRoot hasTopBorder={hasTopBorder}>
      <ButtonBlock onClick={() => (isOpen ? close() : open())}>
        <ButtonInner hasSidePaddings={hasSidePaddings}>
          <div dangerouslySetInnerHTML={{ __html: title }} />
          {isOpen ? <IconMinus /> : <IconPlus />}
        </ButtonInner>
      </ButtonBlock>
      <AccordionBody isOpen={isOpen} isLocked={isLocked} ref={refBody} aria-hidden={isLocked}>
        <AccordionBodyInner isOpen={isOpen} hasSidePaddings={hasSidePaddings}>
          {children}
        </AccordionBodyInner>
      </AccordionBody>
    </AccordionRoot>
  )
}

export default Accordion
