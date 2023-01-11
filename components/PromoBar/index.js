import React from 'react'
import { useSettings } from '@/hooks/Settings'
import styled from '@emotion/styled'
import { theme } from '@theme'
import { ButtonRaw } from '@button'
import getHexBrightness from '../../helpers/getHexBrightness'

const Root = styled.div`
  position: relative;
  width: 100%;
  min-height: 24px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 10px;
  background: ${(p) => p.background};
  color: ${(p) => p.color};
  ${theme.font.body02}
`
const PromoBar = () => {
  const { promoBar } = useSettings()

  const bgColor = promoBar?.backgroundColor ?? '#000000'

  return promoBar && promoBar.title ? (
    <Root background={bgColor} color={getHexBrightness(bgColor) > 65 ? 'black' : 'white'}>
      {promoBar.href && promoBar.href !== '' ? (
        <ButtonRaw href={promoBar.href}>{promoBar.title}</ButtonRaw>
      ) : (
        promoBar.title
      )}
    </Root>
  ) : null
}

export default PromoBar
