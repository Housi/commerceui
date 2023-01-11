import React from 'react'
import styled from '@emotion/styled'
import { mq, theme } from '@theme'
import Container from '@/components/Container'
import Logo from '@/components/Logo'
import Button, { ButtonBig, ButtonBlock, ButtonRaw } from '@button'
import Newsletter from '../Newsletter'

const Root = styled.div`
  ${theme.size.l('padding-bottom')}
  ${theme.size.xl('padding-top')}
`

const Grid = styled.div`
  display: grid;
  ${theme.size.gutter('grid-column-gap')}
  ${theme.size.m('grid-row-gap')}
grid-template-columns: repeat(2,1fr);
  ${mq['md']} {
    grid-template-columns: repeat(4, 1fr);
  }
  ${mq['lg']} {
    grid-template-columns: repeat(8, 1fr);
  }
  ul {
    display: grid;
    grid-row-gap: 12px;
    ${mq['lg']} {
      grid-row-gap: 6px;
    }
  }
`

const LogoWrap = styled.div`
  grid-column: span 2;
  ${mq['md']} {
    order: -1;
  }
  ${mq['lg']} {
    order: -1;
  }
  svg {
    max-width: 160px;
    ${mq['md']} {
      max-width: 240px;
    }
  }
`

const NewsletterWrap = styled.div`
  grid-column: span 2;
  ${mq['md']} {
    grid-column: span 4;
    order: -1;
  }
  ${mq['lg']} {
    order: 1;
  }
  align-self: end;
`

const Footer = ({ firstColumnLinks, secondColumnLinks }) => {
  return (
    <Root>
      <Container isWide>
        <Grid>
          <NewsletterWrap>
            <Newsletter />
          </NewsletterWrap>
          <div>
            <ul>
              {firstColumnLinks.items.map((item, i) => (
                <li key={i}>
                  <Button href={item.href} target={item.openInNewTab ? '_blank' : null}>
                    {item.title}
                  </Button>
                </li>
              ))}
              <li>
                <Button data-acsb="trigger">Accessibility</Button>
              </li>
            </ul>
          </div>
          <div>
            <ul>
              {secondColumnLinks.items.map((item, i) => (
                <li key={i}>
                  <Button href={item.href} target={item.openInNewTab ? '_blank' : null}>
                    {item.title}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <LogoWrap>
            <ButtonRaw href={'/'}>
              <Logo />
            </ButtonRaw>
          </LogoWrap>
        </Grid>
      </Container>
    </Root>
  )
}
export default Footer
