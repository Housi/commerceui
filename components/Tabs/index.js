import React, { useState } from 'react'
import { ButtonTab } from '@button'

import { theme } from '@theme'
import styled from '@emotion/styled'
import { ButtonNavTab } from '@button'

const Head = styled.div`
  display: inline-grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  grid-gap: 16px;
  margin-bottom: 4px;
  margin-left: -4px;
  position: sticky;
  top: 0;
  width: 100%;
  background: white;
  z-index: 1;
  ${theme.size.xs('padding-bottom')}
`
const Body = styled.div`
  ${theme.size.s('padding-bottom')}
  ${theme.size.xs('padding-top')}
  overflow-y: scroll;
`
const Tab = styled.div`
  display: ${(props) => (props.isActive ? 'block' : 'none')};
  ${theme.font.body03}
  p {
    margin: 0;
  }
  ul {
    margin: 0;
    padding-left: 8px;
  }

  p + p,
  p + ul {
    margin-top: 1em;
  }
`
const Tabs = ({ tabs, ariaLabel, id, buttonStyle }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  return (
    <div>
      <Head role={'tablist'} aria-label={ariaLabel}>
        {tabs &&
          tabs.length > 0 &&
          tabs.map((tab, i) => {
            let buttonProps = {
              key: i,
              onClick: tab.href ? null : () => setActiveTabIndex(i),
              isActive: activeTabIndex === i,
              role: tab.href ? null : 'tab',
              'aria-selected': tab.href ? null : `${activeTabIndex === i}`,
              id: id + '-tab-' + (i + 1),
              children: tab.title,
              href: tab.href
            }

            if (buttonStyle === 'NAV') {
              return <ButtonNavTab {...buttonProps} />
            } else {
              return <ButtonTab {...buttonProps} />
            }
          })}
      </Head>
      <Body>
        {tabs &&
          tabs.length > 0 &&
          tabs.map((tab, i) => (
            <Tab
              isActive={activeTabIndex === i}
              key={i}
              role={'tabpanel'}
              id={id + '-panel-' + (i + 1)}
              aria-labelledby={id + '-tab-' + (i + 1)}
            >
              {React.isValidElement(tab.content) ? (
                tab.content
              ) : (
                <div dangerouslySetInnerHTML={{ __html: tab.content }} />
              )}
            </Tab>
          ))}
      </Body>
    </div>
  )
}

export default Tabs
