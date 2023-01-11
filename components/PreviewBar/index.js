import React from 'react'
import styled from '@emotion/styled'

import { theme } from '@theme'

import { ButtonRaw } from '@button'

const Root = styled.div`
  ${theme.font.caps07}
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  transition: all 300ms;
  background: transparent;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.3);
  color: white;
  ${theme.size.containerWideMargin('padding-left')}
  ${theme.size.containerWideMargin('padding-right')}
a {
    background: black;
    color: white;
    display: flex;
    align-items: center;
    line-height: 1;
    padding: 4px 10px;
  }
`

const PreviewBar = ({ isPreview, ...previewData }) => {
  if (!isPreview) {
    return null
  }

  return (
    <Root>
      {previewData?.message ? `You are previewing: ${previewData.message}` : 'You are in preview mode'}
      <ButtonRaw href={'/api/exit-preview'}>EXIT PREVIEW</ButtonRaw>
    </Root>
  )
}

export default PreviewBar
