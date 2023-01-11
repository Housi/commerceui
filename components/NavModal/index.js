import React, { useState } from 'react'
import styled from '@emotion/styled'
import { theme, mq, lin, rs } from '@theme'
import { useUI } from '@/hooks/UI'
import { ButtonBig } from '@button'
import Tabs from '../Tabs'
import SplitsModal from '@/components/Modal'

const Body = styled.div`
  position: relative;
  overflow-y: auto;
  ${theme.size.containerWideMargin('padding-left')}
`

const ButtonWrapper = styled.div`
  position: relative;
  ${(props) => (props.isActive ? 'opacity: 1;' : 'opacity: 0.5;')}
  transition: opacity 200ms;
`
const TabContentStyled = styled.div`
  ${theme.size.s('padding-top')}
`
const TabContent = ({ links }) => {
  const [hoveredIndex, setHoveredIndex] = useState(-1)
  return (
    <TabContentStyled>
      {links.map((link, i) => {
        return (
          <ButtonWrapper isActive={hoveredIndex === -1 || i === hoveredIndex} key={i}>
            <ButtonBig
              href={link.href}
              onMouseEnter={() => {
                setHoveredIndex(i)
              }}
              onMouseLeave={() => setHoveredIndex(-1)}
            >
              {link.title}
            </ButtonBig>
          </ButtonWrapper>
        )
      })}
    </TabContentStyled>
  )
}
const NavModal = ({ tabs }) => {
  const { isNavOpen, closeNav } = useUI()

  return (
    <>
      <SplitsModal
        isOpen={isNavOpen}
        onRequestClose={closeNav}
        closeTimeoutMS={theme.timing.modalAnimation}
        placement={'left'}
        isWide
      >
        <Body>
          <Tabs
            tabs={tabs.items.map((t, i) => ({
              title: t.title,
              href: t.href,
              openInNewTab: t.openInNewTab,
              content: t.__typename === 'GlobalSettingsMenuTab' ? <TabContent key={i} links={t.links.items} /> : null
            }))}
            ariaLabel={'Navigation tabs'}
            id={'nav_tabs'}
            buttonStyle={'NAV'}
          />
        </Body>
      </SplitsModal>
    </>
  )
}

export default NavModal
