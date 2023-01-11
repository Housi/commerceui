import React, { useState } from 'react'
import { NextSeo } from 'next-seo'

import { mq, theme } from '@theme'
import styled from '@emotion/styled'
import RichText from '@/components/RichText'
import { useRouter } from 'next/router'
import Accordion from '@/components/Accordion'
import { ButtonBlock, ButtonNavTab } from '@button'
import Container from '@/components/Container'
import IconArrow from '@/components/_icons/IconArrow'

const NAV_ITEMS = [
  {
    title: 'Contact us',
    href: '/contact-us'
  },
  {
    title: 'FAQ',
    href: '/faq'
  },
  {
    title: 'Shipping & Returns',
    href: '/shipping-and-returns'
  },
  {
    title: 'Accessibility',
    href: '/accessibility'
  },
  {
    title: 'Privacy Policy',
    href: '/privacy-policy'
  }
]

const NavButtonInner = styled.div`
  ${theme.font.caps07}
  height: 60px;
  border-bottom: 1px solid ${theme.colors.mono100};
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${(props) =>
    props.isActive
      ? `
  svg {
    transform: rotate(-90deg);
  }
`
      : `svg {display: none;}`}
`

const Grid = styled.div`
  position: relative;
  ${theme.size.gutter('grid-gap')}
  ${theme.size.menuBarHeight('padding-top')}
${mq['lg']} {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    min-height: 100vh;
  }
`

const Nav = styled.div`
  display: none;
  ${mq['lg']} {
    display: block;
    grid-column: span 2;
  }
  a {
    max-width: 250px;
  }
`
const NavSticky = styled.div`
  position: sticky;
  ${theme.size.menuBarHeight('top')}
  ${theme.size.m('padding-top')}
a:first-of-type {
    div {
      border-top: 1px solid ${theme.colors.mono100};
    }
  }
`
const Main = styled.div`
  position: relative;
  ${theme.size.m('padding-top')}
  ${mq['lg']} {
    grid-column: 4 / span 4;
  }
  align-self: start;
  display: grid;
  ${theme.size.m('grid-row-gap')}
`
const Title = styled.h1`
  ${theme.font.caps05}
`

const AccordionWrap = styled.div`
  border-top: 1px solid ${theme.colors.mono100};
`
const AccordionTogglerWrap = styled.div`
  display: inline-grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  ${theme.size.s('grid-column-gap')}
  ${theme.size.s('margin-bottom')}
  padding: 2px 20px;
  ${mq['lg']} {
    padding: 2px;
  }
`
const HorizontalScrollWrap = styled.div`
  overflow-x: auto;
  display: block;
  margin-left: -20px;
  margin-right: -20px;
  ${mq['lg']} {
    margin-left: 0;
    margin-right: 0;
  }
`

const UtilityPage = ({ data, noindex, nofollow }) => {
  const tags = ['All']

  const [activeTag, setActiveTag] = useState(tags[0])
  const router = useRouter()

  if (!data) {
    return '404'
  }

  if (data.accordionCollection) {
    data.accordionCollection.items.forEach((item) => {
      if (!tags.includes(item.tag) && item.tag !== '' && item.tag !== null) {
        tags.push(item.tag)
      }
    })
  }

  const currentPath = router.pathname

  return (
    <Container isWide>
      <NextSeo
        {...{
          title: data.title,
          description: data.description,
          noindex: noindex,
          nofollow: nofollow
        }}
      />
      <Grid>
        <Nav>
          <NavSticky>
            {NAV_ITEMS.map((n, i) => {
              return (
                <ButtonBlock href={n.href} key={i}>
                  <NavButtonInner isActive={currentPath === n.href}>
                    {n.title} <IconArrow />
                  </NavButtonInner>
                </ButtonBlock>
              )
            })}
          </NavSticky>
        </Nav>
        <Main>
          <Title>{data.title}</Title>

          {data.richText && <RichText {...data.richText} />}

          {data.accordionCollection?.items.length > 0 && (
            <div>
              <HorizontalScrollWrap>
                <AccordionTogglerWrap>
                  {tags.map((t, i) => (
                    <ButtonNavTab key={i} onClick={() => setActiveTag(t)} isActive={t === activeTag}>
                      {t}
                    </ButtonNavTab>
                  ))}
                </AccordionTogglerWrap>
              </HorizontalScrollWrap>
              <AccordionWrap>
                {data.accordionCollection.items.map((a, i) => {
                  if (activeTag !== 'All' && activeTag !== a.tag) {
                    return null
                  }
                  return (
                    <Accordion title={'Q: ' + a.title} key={i}>
                      <RichText {...a.content} />
                    </Accordion>
                  )
                })}
              </AccordionWrap>
            </div>
          )}
        </Main>
      </Grid>
    </Container>
  )
}

export default UtilityPage
