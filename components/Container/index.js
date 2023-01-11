import React from 'react'

import styled from '@emotion/styled'
import { theme } from '@theme'

const ContainerS = styled.div`
  ${(props) =>
    props.isWide
      ? `
 ${theme.size.containerWideMargin('margin-left')}
 ${theme.size.containerWideMargin('margin-right')}
`
      : `
 ${theme.size.containerMargin('margin-left')}
 ${theme.size.containerMargin('margin-right')}
`}
`

const Container = ({ children, isWide = false }) => <ContainerS isWide={isWide}>{children}</ContainerS>
export default Container
