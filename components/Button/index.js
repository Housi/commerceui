import React from 'react'
import NextLink from 'next/link'

import styled from '@emotion/styled'

import { theme, lin, mq } from '@theme'
import Logo from '@/components/Logo'
import getHexBrightness from '@/helpers/getHexBrightness'

const INLINE_FLEX_CENTER = `
display: inline-flex;
align-items: center;
justify-content: center;
text-align: center;
`

const DEFAULT = (props) => `
  appearance: none;
  border: 0;
  margin: 0;
  cursor: pointer;
  background: none;
  padding: 0;
  ${props.disabled ? 'pointer-events: none;' : ''}
`
const styleDefault = (props) => `
  ${INLINE_FLEX_CENTER}
  white-space: nowrap;
  transition: all 200ms;
  ${theme.font.caps07}
  ${
    props.disabled
      ? `
  color: ${theme.colors.mono500};
  background: ${theme.colors.mono700};
  `
      : ''
  }
  ${props.isActive ? `text-decoration: underline;` : ``}
`
const stylePrimary = (props) => `
  ${INLINE_FLEX_CENTER}
  white-space: nowrap;
  background: black;
  color: white;
  height: 60px;
  transition: all 200ms;
  ${theme.font.caps07}
  ${
    props.disabled
      ? `
  color: ${theme.colors.mono500};
  background: ${theme.colors.mono700};
  `
      : ''
  }
`
const styleSecondary = (props) => `
  ${INLINE_FLEX_CENTER}
  white-space: nowrap;
  height: 60px;
  transition: all 200ms;
  min-width: 180px;
  padding: 0 20px;
  ${theme.font.caps07}
  ${props.disabled ? `opacity: 0.5;` : ''}
  color: ${props.isWhite ? 'white' : 'black'};
  border: 1px solid ${props.isWhite ? 'white' : 'black'};
  &:hover {
    background: ${props.isWhite ? 'white' : 'black'};
    color: ${props.isWhite ? 'black' : 'white'};
  }
`
const styleOutline = (props) => `
  white-space: nowrap;
  ${INLINE_FLEX_CENTER}
  transition: all 200ms;
  ${theme.font.lightCaps01}
  color: ${theme.colors.mono700};
  padding: 4px;
`
const styleNavTab = (props) => `
  white-space: nowrap;
  ${INLINE_FLEX_CENTER}
  transition: all 200ms;
  ${theme.font.caps07}
  color: ${props.isActive ? 'black' : theme.colors.mono500};
  padding: 4px;
  text-decoration: ${props.isActive ? 'underline' : 'none'};
  &:hover {
    color: black;
  }
`
const styleTab = (props) => `
  white-space: nowrap;
  ${INLINE_FLEX_CENTER}
  transition: all 200ms;
  ${theme.font.lightCaps01}
  color: ${props.isActive ? 'black' : theme.colors.mono500};
  padding: 4px;
  text-decoration: ${props.isActive ? 'underline' : 'none'};
  &:hover {
    color: black;
  }
`
const styleUnderline = (props) => `
  white-space: nowrap;
  ${INLINE_FLEX_CENTER}
  ${theme.font.body02}
  transition: all 200ms;
  padding: 4px;
  text-decoration: underline;
`
const styleLogo = (props) => `
  ${lin('height', 28, 60)}
  ${lin('width', 28 * (500 / 85.38), 60 * (500 / 85.38))}
  ${
    props.isLaVisible
      ? `
  `
      : `
  .logo-la {
    display: none;
  }
  `
  }
  svg {
    fill: currentColor;
  }
`
const styleBig = (props) => `
  ${theme.font.caps03}
  ${lin('font-size', 40, 70)}
  ${lin('padding-top', 2, 10)}
  ${lin('padding-bottom', 2, 10)}
  display: inline-flex;
  overflow: hidden;
`

const styleColor = ({ color, colorMobile }) => {
  if (!color) {
    color = '#000000'
  }

  if (!colorMobile) {
    colorMobile = color
  }

  return `
  ${INLINE_FLEX_CENTER}
  white-space: nowrap;
  height: 1.8em;
  transition: all 200ms;
  min-width: 3em;
  padding: 0 1em;
  ${theme.font.caps04}
  ${lin('font-size', 20, 55)}
  color: ${colorMobile};
  border: 0.095em solid ${colorMobile};
  &:hover {
    background: ${colorMobile};
    color: ${getHexBrightness(colorMobile) > 65 ? 'black' : 'white'};
  }
  ${mq['lg']} {
    border: 0.065em solid ${color};
    color: ${color};
    border: 0.095em solid ${color};
    &:hover {
      background: ${color};
      color: ${getHexBrightness(color) > 65 ? 'black' : 'white'};
    }
  }
`
}

const putStyle = (kind, props) => {
  switch (kind) {
    case 'default':
      return styleDefault(props)
    case 'primary':
      return stylePrimary(props)
    case 'secondary':
      return styleSecondary(props)
    case 'color':
      return styleColor(props)
    case 'outline':
      return styleOutline(props)
    case 'tab':
      return styleTab(props)
    case 'nav-tab':
      return styleNavTab(props)
    case 'underline':
      return styleUnderline(props)
    case 'logo':
      return styleLogo(props)
    case 'block':
      return `display: block; width: 100%; color: currentColor;`
    case 'big':
      return styleBig(props)
    default:
      return ``
  }
}

const ButtonStyled = styled.button`
  ${DEFAULT}
  ${(props) => putStyle(props.kind, props)}
`
const LinkStyled = styled.a`
  ${DEFAULT}
  ${(props) => putStyle(props.kind, props)}
`

const Base = (props) => {
  if (props.href) {
    return (
      <NextLink href={props.href} passHref scroll={props.scroll}>
        <LinkStyled kind={props.kind} {...props} href={null}>
          {props.children}
        </LinkStyled>
      </NextLink>
    )
  }
  return <ButtonStyled kind={props.kind} {...props} type={props.type ?? 'button'} />
}

const Button = (props) => <Base kind={'default'} {...props} />
const ButtonRaw = (props) => <Base kind={'raw'} {...props} />
const ButtonPrimary = (props) => <Base kind={'primary'} {...props} />
const ButtonSecondary = (props) => <Base kind={'secondary'} {...props} />
const ButtonOutline = (props) => <Base kind={'outline'} {...props} />
const ButtonUnderline = (props) => <Base kind={'underline'} {...props} />
const ButtonTab = (props) => <Base kind={'tab'} {...props} />
const ButtonLogo = (props) => (
  <Base kind={'logo'} {...props}>
    <Logo />
  </Base>
)
const ButtonNavTab = (props) => <Base kind={'nav-tab'} {...props} />
const ButtonBlock = (props) => <Base kind={'block'} {...props} />
const ButtonBig = (props) => <Base kind={'big'} {...props} />
const ButtonColor = (props) => <Base kind={'color'} {...props} />

export default Button

export {
  ButtonPrimary,
  ButtonRaw,
  ButtonOutline,
  ButtonTab,
  ButtonUnderline,
  ButtonLogo,
  ButtonColor,
  ButtonSecondary,
  ButtonNavTab,
  ButtonBlock,
  ButtonBig
}
