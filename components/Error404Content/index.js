import React from 'react'
import { ButtonSecondary } from '@button'
import styled from '@emotion/styled'
import { theme } from '@theme'

const Root = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h1 {
    ${theme.font.caps01}
  }
  p {
    ${theme.font.caps07}
    ${theme.size.m('margin-bottom')}
  }
`

const Error404Content = () => {
  return (
    <Root>
      <h1>404</h1>
      <p>This page does not exist.</p>

      <ButtonSecondary href={'/'}>Go to homepage</ButtonSecondary>
    </Root>
  )
}

export default Error404Content
