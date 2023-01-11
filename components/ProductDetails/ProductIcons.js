import React from 'react'

import styled from '@emotion/styled'
import { theme } from '@theme'

const Root = styled.div`
  display: inline-grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  ${theme.size.s('grid-column-gap')}
  span {
    ${theme.font.lightCaps01}
    ${theme.size.xs('margin-top')}
  }
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  img {
    max-width: 32px;
    max-height: 32px;
  }
`

const ProductIcons = ({ icons, iconsMap }) => {
  if (icons.length === 0) {
    return null
  }

  return (
    <Root>
      {iconsMap.map((icon, i) => {
        if (!icons.includes(icon.iconTag)) {
          return null
        }

        return (
          <div key={i}>
            <img src={icon.icon.src} />
            <span>{icon.title}</span>
          </div>
        )
      })}
    </Root>
  )
}

export default ProductIcons
