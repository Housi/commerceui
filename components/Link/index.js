import React from 'react'
import NextLink from 'next/link'
import styled from '@emotion/styled'

import { theme } from '@theme'

const A = styled.a`
  &:focus {
    //outline: none;
  }
  &:focus-visible {
    ${theme.utils.focusVisible}
  }
`

const Link = (props) => (
  <NextLink {...props} passHref>
    <A>{props.children}</A>
  </NextLink>
)
export default Link
