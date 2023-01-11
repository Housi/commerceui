import React from 'react'
import styled from '@emotion/styled'
import { theme } from '@theme'
import Image from '@image'

const Root = styled.div`
  position: relative;
  padding: 1px;
  border-radius: 50%;
  border: 1px solid transparent;
  ${(props) =>
    props.isCurrent
      ? `
  border-color: ${theme.colors.mono700};
`
      : ''}
  ${(props) =>
    props.isSelected && !props.isCurrent
      ? `
  background-color: ${theme.colors.mono300};
`
      : ''}
`
const HexDot = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.hex};
  border-radius: 50%;
  border: 1px solid white;
  ${(props) => (props.hasBorder ? `border: 1px solid ${theme.colors.mono400};` : '')}
`
const ImageDot = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid white;
`

const Placeholder = styled.div`
  ${(props) =>
    props.isSmall
      ? `
  width: 15px; height: 15px;
  `
      : `
  width: 30px; height: 30px;
  `}
`

const SwtachDot = ({ swatchName, swatchMap, isSmall, isSelected, isCurrent }) => {
  if (!swatchName) {
    return null
  }

  const condition = (s) => s.title.toLowerCase() === swatchName.toLowerCase()

  const hex = swatchMap.find(condition)?.hex ?? null
  const image = swatchMap.find(condition)?.image ?? null

  if (hex === null && image === null) {
  }

  return (
    <Root isSelected={isSelected} isCurrent={isCurrent}>
      {hex && <HexDot hex={hex} hasBorder={hex === '#FFFFFF' || hex === '#ffffff' || hex === 'white'} />}
      {image && (
        <ImageDot>
          <Image image={image} sizes={'30px'} backgroundColor={'transparent'} disableTransition />
        </ImageDot>
      )}
      {!image && !hex && (
        <HexDot
          hex={swatchName.startsWith('color-') ? swatchName.replace('color-', '') : '#333333'}
          hasBorder={hex === '#FFFFFF' || hex === '#ffffff' || hex === 'white' || swatchName === 'color-white'}
        />
      )}
      <Placeholder isSmall={isSmall} />
    </Root>
  )
}

export default SwtachDot
