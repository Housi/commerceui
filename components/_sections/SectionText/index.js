import React from 'react'
import styled from '@emotion/styled'
import { theme } from '@theme'
import Container from '../../Container'

const Main = styled.div`
  position: relative;
  h2 {
    ${theme.font.caps03}
  }
  p {
    ${theme.font.body01}
    margin-top: 1em;
  }
  max-width: 540px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  ${theme.size.s('margin-bottom')}
  ${theme.size.m('margin-top')}
`
const SectionText = ({ title, paragraph }) => {
  return (
    <Container>
      <Main>
        <h2 dangerouslySetInnerHTML={{ __html: title }} />
        {paragraph && <p dangerouslySetInnerHTML={{ __html: paragraph }} />}
      </Main>
    </Container>
  )
}

export default SectionText
