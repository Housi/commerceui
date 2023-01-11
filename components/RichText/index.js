import React from 'react'

import { theme } from '@theme'
import styled from '@emotion/styled'

import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

const Root = styled.div`
  position: relative;
  h2 {
    ${theme.font.caps07}
  }
  h3 {
    ${theme.font.caps07}
  }
  h4 {
    ${theme.font.caps07}
  }
  p,
  ul,
  ol {
    b {
      font-weight: 500;
    }
    ${(props) => (props.isSmall ? theme.font.body03 : theme.font.body02)}
  }
  h2,
  h3,
  h4 {
    margin-bottom: 0.5em;
  }

  ul,
  ol,
  p {
    & + p,
    & + ul,
    & + ol {
      margin-top: 1em;
    }
    & + h2 {
      margin-top: 3em;
    }
    & + h3,
    & + h4 {
      margin-top: 2em;
    }
  }
  a {
    text-decoration: underline;
  }
  u {
    text-decoration: underline;
  }
  ul {
    padding-left: 1.1em;
    list-style: disc;
  }
  ol {
    list-style: decimal;
    padding-left: 1.1em;
  }
  blockquote {
    text-align: center;
    margin: 3em auto;
    &,
    p {
      ${theme.font.body01}
      max-width: 500px;
    }
  }
`

const RichText = ({ json, plainHtml, isSmall }) => {
  if (!json && !plainHtml) {
    return null
  }

  return (
    <Root isSmall={isSmall}>
      {json && documentToReactComponents(json)}
      {plainHtml && <div dangerouslySetInnerHTML={{ __html: plainHtml }} />}
    </Root>
  )
}

export default RichText
