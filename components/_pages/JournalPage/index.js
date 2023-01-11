import React, { useState } from 'react'
import styled from '@emotion/styled'
import { theme, mq } from '@theme'
import JournalCard from '@/components/JournalCard'
import Container from '@/components/Container'

const PageTitle = styled.h1`
  ${theme.size.menuBarHeight('margin-top')}
  ${theme.size.m('margin-bottom')}
  ${theme.size.m('padding-top')}
  ${theme.size.containerMargin('padding-left')}
  ${theme.size.containerMargin('padding-right')}
  ${theme.font.caps03}
`
const Root = styled.div``

const Posts = styled.div`
  display: grid;
  ${theme.size.gutter('grid-column-gap')}
  ${theme.size.m('grid-row-gap')}
  ${mq['lg']} {
    grid-template-columns: 1fr 1fr;
  }
`
const CardWrap = styled.div`
  ${mq['md']} {
    ${(p) => (p.isFullWidth ? `grid-column: span 2;` : ``)}
  }
`
const JournalPage = ({ entries, title, isPressPage }) => {
  return (
    <Root>
      <PageTitle>{title}</PageTitle>
      <Container>
        <Posts>
          {entries &&
            entries.map((entry, i) => {
              const isFullWidth = isPressPage ? false : i % 3 === 0
              return (
                <CardWrap key={i} isFullWidth={isFullWidth}>
                  <JournalCard {...entry} isFullWidth={isFullWidth} />
                </CardWrap>
              )
            })}
        </Posts>
      </Container>
    </Root>
  )
}

export default JournalPage
