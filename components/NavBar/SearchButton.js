import React, { useState, useRef, useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom'
import styled from '@emotion/styled'

import { theme, mq, lin } from '@theme'

import Button, { ButtonLogo, ButtonBlock } from '@button'
import IconSearch from '@/components/_icons/IconSearch'
import SearchResults from '@/components/NavBar/SearchResults'
import { useRouter } from 'next/router'
import IconClose from '@/components/_icons/IconClose'

const Popover = styled.div`
  position: fixed;
  left: 0;
  width: 0;
  top: 0;
  margin-top: 1px;
  background: white;
  z-index: 2;
  height: calc(100vh - 100px);
  ${mq['lg']} {
    height: auto;
  }
`

const ButtonInner = styled.div`
  white-space: nowrap;
  ${theme.font.caps06}
  line-height: 1;
  transition: all 200ms;
  position: relative;
  height: 32px;
  display: flex;
  align-items: center;
  padding: 0 4px;
  span {
    color: white;
  }
  svg {
    fill: currentColor;
  }
`
const HideOnDesktop = styled.div`
  display: inline-flex;
  ${mq['lg']} {
    display: none;
  }
`

const HideOnMobile = styled.div`
  display: none;
  ${mq['lg']} {
    display: inline-flex;
  }
`

const MainWrap = styled.div`
  border-bottom: 1px solid currentColor;
  align-items: center;
  @media (max-width: 999px) {
    //transition: transform 200ms ${theme.ease.quadOut};
    ${(props) => (props.isMobileModalVisible ? `transform: none;` : `transform: translateY(-100%);`)}
    display: flex;
    position: fixed;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
    ${theme.size.menuBarHeight('height')}
    background: white;
    ${theme.size.s('padding-left')}
    ${theme.size.s('padding-right')}
  }
  ${mq['lg']} {
    transition: width 200ms ${theme.ease.quadOut};
    height: 32px;
    position: relative;
    display: flex;
    ${(props) =>
      props.isExpanded
        ? `
  width: 450px;
  `
        : `width: 160px;`}
  }
`
const FormWrap = styled.form`
  width: 100%;
  display: flex;
  height: 100%;
  button + button {
    ${theme.size.s('margin-left')}
  }
`

const IconWrap = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  pointer-events: none;
`

const Input = styled.input`
  min-width: 0;
  appearance: none;
  width: auto;
  border: 0;
  background: none;
  color: white;
  flex-grow: 1;
  padding-left: 32px;
  ${theme.font.lightCaps02}
  z-index: 2;
  height: 100%;
  &:focus {
    outline: none;
  }
  color: black;
  ${mq['lg']} {
    color: white;
  }
`

const Backdrop = styled.div`
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  ${(props) => (props.isVisible ? 'opacity: 1; ' : 'opacity: 0; pointer-events: none;')}
  transition: opacity 200ms;
  background: rgba(0, 0, 0, 0.5);
  ${mq['lg']} {
    background: transparent;
  }
`
const SearchResultsPopover = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null
  return ReactDOM.createPortal(
    <Popover id={'SearchResultsPopover'}>{children}</Popover>,
    document.getElementById('modalContainer')
  )
}
const MobileInputBackdropDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  ${theme.size.menuBarHeight('height')}
  background: black;
`
const MobileInputBackdrop = ({ isOpen }) => {
  if (!isOpen) return null
  return ReactDOM.createPortal(<MobileInputBackdropDiv />, document.getElementById('modalContainer'))
}
const SearchButton = () => {
  const [isLoaded, setLoaded] = useState(false)
  const [isExpanded, setExpanded] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false)
  const [isMobileModalVisible, setMobileModalVisible] = useState(false)

  const [searchValue, setSearchValue] = useState('')
  const [inputValue, setInputValue] = useState('')

  const router = useRouter()

  const debounceTime = 300
  const debounceTimeout = useRef(null)

  const refInput = useRef(null)

  const onInputChange = (val) => {
    setInputValue(val)

    clearTimeout(debounceTimeout.current)

    if (val === '') {
      // no debounce for empty
      onSearchValueChange(val)
    } else {
      debounceTimeout.current = setTimeout(() => {
        onSearchValueChange(val)
      }, debounceTime)
    }

    // When value changed, we want to open
    if (refInput.current === document.activeElement) {
      setModalVisible(true)
      setPopoverPosition()
      setExpanded(true)
    }
  }

  const onSearchValueChange = (val) => {
    setSearchValue(val)
  }

  const focusInput = () => {
    refInput.current.focus()
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (searchValue === '') {
      focusInput()
    } else {
      router.push('/search?data=' + inputValue)
      setExpanded(false)
      setMobileModalVisible(false)
    }
  }

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27 && isModalVisible) {
      focusInput()
      setModalVisible(false)
    }
  }, [])

  const setPopoverPosition = () => {
    const elemPopover = document.getElementById('SearchResultsPopover')
    if (!elemPopover) {
      return
    }
    const inputRect = refInput.current.parentElement.getBoundingClientRect()
    elemPopover.style.top = inputRect.y + inputRect.height + 'px'
    elemPopover.style.left = inputRect.x + 'px'
    elemPopover.style.width = inputRect.width + 'px'
  }

  useEffect(() => {
    if (isMobileModalVisible) {
      focusInput()
    }
  }, [isMobileModalVisible])

  useEffect(() => {
    if (router.query.data && !isLoaded) {
      setInputValue(router.query.data)
      setLoaded(true)
    }

    const handleRouteChangeStart = (url) => {
      setModalVisible(false)
      setMobileModalVisible(false)
      setExpanded(false)
    }

    const handleRouteChangeComplete = (url) => {
      if (!url.includes('/search')) {
        setInputValue('')
      }
    }

    document.addEventListener('keydown', escFunction, false)
    window.addEventListener('resize', setPopoverPosition)
    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeComplete)
      router.events.off('routeChangeComplete', handleRouteChangeStart)
      document.removeEventListener('keydown', escFunction, false)
      window.removeEventListener('resize', setPopoverPosition)
    }
  })

  return (
    <>
      <HideOnDesktop>
        <ButtonBlock
          onClick={() => {
            setMobileModalVisible(true)
            refInput.current.focus()
            focusInput()
          }}
        >
          <ButtonInner>
            <IconSearch />
          </ButtonInner>
        </ButtonBlock>
      </HideOnDesktop>

      <MainWrap isExpanded={isExpanded} isMobileModalVisible={isMobileModalVisible}>
        <IconWrap>
          <IconSearch />
        </IconWrap>
        <FormWrap onSubmit={onSubmit} action={''}>
          <Input
            isExpanded={isExpanded}
            placeholder={isExpanded ? 'What are you looking for?' : ''}
            value={inputValue}
            ref={refInput}
            name={'search'}
            autoComplete={'off'}
            onFocus={() => {
              setExpanded(true)
            }}
            type={'search'}
            onChange={(e) => {
              onInputChange(e.target.value)
            }}
          />

          <HideOnMobile>
            <Button type={'submit'} tabIndex={-1}>
              <ButtonInner>
                <span>Search</span>
              </ButtonInner>
            </Button>
          </HideOnMobile>

          <MobileInputBackdrop isOpen={isMobileModalVisible} />

          <HideOnDesktop>
            <Button
              type={'button'}
              tabIndex={-1}
              onClick={() => {
                setModalVisible(false)
                setMobileModalVisible(false)
                setExpanded(false)
              }}
            >
              <ButtonInner>
                <span>Close&nbsp;</span>
                <IconClose />
              </ButtonInner>
            </Button>
          </HideOnDesktop>
        </FormWrap>

        <SearchResultsPopover isOpen={isModalVisible} onClose={() => setModalVisible(false)}>
          <SearchResults value={searchValue} />
        </SearchResultsPopover>
      </MainWrap>

      <Backdrop
        isVisible={isExpanded} // desktop OR mobile condition
        onClick={() => {
          setModalVisible(false)
          setMobileModalVisible(false)
          setExpanded(false)
        }}
      />
    </>
  )
}

export default SearchButton
