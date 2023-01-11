import React from 'react'

const breakpoints = [
  {
    name: 'sm',
    value: 430
  },
  {
    name: 'md',
    value: 740
  },
  {
    name: 'lg',
    value: 1000
  },
  {
    name: 'xl',
    value: 1300
  },
  {
    name: 'xxl',
    value: 1900
  }
]
let mq = []

breakpoints.forEach((b, i) => {
  let key = `@media (min-width: ${b.value}px)`
  mq[i] = key
  mq[b.name] = key
})

const lin = (
  cssProp,
  mobileValue,
  desktopValue,
  minViewportWidth = breakpoints[0].value,
  maxViewportWidth = breakpoints[breakpoints.length - 1].value
) => {
  const KEY_DESKTOP = `@media (min-width:${maxViewportWidth}px)`
  const KEY_IN_BETWEEN = `@media (min-width: ${minViewportWidth}px) and (max-width: ${maxViewportWidth}px)`
  const VALUE_IN_BETWEEN = `calc(${mobileValue}px + (${desktopValue} - ${mobileValue}) * ((100vw - ${minViewportWidth}px) / (${maxViewportWidth} - ${minViewportWidth})))`

  return `${cssProp}: ${mobileValue}px; ${KEY_IN_BETWEEN} { ${cssProp}: ${VALUE_IN_BETWEEN}; } ${KEY_DESKTOP} { ${cssProp}: ${desktopValue}px; }`
}
const rs = (cssProp, values) => {
  return values
    .map((v, i) => {
      if (v) {
        if (i === 0) {
          return `${cssProp}: ${v};`
        } else {
          return `${mq[i - 1]} { ${cssProp}: ${v}; }`
        }
      } else {
        return null
      }
    })
    .join(' ')
}

const S = []

S.s0 = 0
S.s1 = 1
S.s2 = 2
S.s3 = 4
S.s4 = 6
S.s5 = 8
S.s6 = 12
S.s7 = 16
S.s8 = 24
S.s9 = 32
S.s10 = 48
S.s11 = 64
S.s12 = 96
S.s13 = 128
S.s14 = 160
S.s15 = 160
S.s16 = 160

const ease = {
  quadIn: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  quadOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  quadInOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  cubicIn: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  cubicOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  cubicInOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  quartIn: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
  quartOut: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  quartInOut: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  quintIn: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
  quintOut: 'cubic-bezier(0.23, 1, 0.32, 1)',
  quintInOut: 'cubic-bezier(0.23, 1, 0.32, 1)',
  expoIn: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
  expoOut: 'cubic-bezier(0.19, 1, 0.22, 1)',
  expoInOut: 'cubic-bezier(0.19, 1, 0.22, 1)'
}

const SANS_REGULAR = `
font-family: DINCondensed,sans-serif;
font-weight: 400;
font-style: normal;`
const SANS_LIGHT = `
font-family: DINCondensed,sans-serif;
font-weight: 300;
font-style: normal;
`

const CAPS_STYLE = `
text-transform: uppercase;
letter-spacing: -0.01em;
`

const theme = {
  colors: {
    black: '#000',
    white: '#fff',
    // red: '#CD3105',
    red: '#ff0000',
    mono50: '#f9f9f9',
    mono100: '#ededed',
    mono200: '#e1e1e1',
    mono300: '#cecece',
    mono400: '#bebebe',
    mono500: '#aaa',
    mono600: '#aaa',
    mono700: '#838383',
    mono800: '#3d3d3d',
    mono900: '#313131'
  },
  globalStyles: `
    .hide-on-desktop {
      ${mq['lg']} {
        display: none;
      }
    }
    .hide-on-mobile {
      display: none;
      ${mq['lg']} {
        display: block;
      }
    }
    #modalContainer {
      z-index: 10;
    }
  `,
  font: {
    /*

    caps:

    1  150
    2  60
    3  50
    4  40
    5  36
    6  20
    7  16
    8  12

    body:

    1 16 /1.13 300 -0.016em
    2 16 /1.13 300 -0.016em
    3 14 */

    caps01: `
      ${SANS_REGULAR}
      ${lin('font-size', 50, 150)}
      line-height: 1;
      ${CAPS_STYLE}
    `,
    caps02: `
      ${SANS_REGULAR}
      ${lin('font-size', 45, 60)}
      line-height: 1;
      ${CAPS_STYLE}
    `,
    caps03: `
      ${SANS_REGULAR}
      ${lin('font-size', 40, 50)}
      line-height: 1;
      ${CAPS_STYLE}
    `,
    caps04: `
      ${SANS_REGULAR}
      ${lin('font-size', 35, 40)}
      line-height: 1;
      ${CAPS_STYLE}
    `,
    caps05: `
      ${SANS_REGULAR}
      ${lin('font-size', 24, 36)}
      line-height: 1;
      ${CAPS_STYLE}
    `,
    caps06: `
      ${SANS_REGULAR}
      ${lin('font-size', 18, 20)}
      line-height: 1.2;
      ${CAPS_STYLE}
    `,
    caps07: `
      ${SANS_REGULAR}
      ${lin('font-size', 16, 16)}
      line-height: 1.2;
      ${CAPS_STYLE}
    `,
    lightCaps01: `
      ${SANS_LIGHT}
      font-size: 14px;
      text-transform: uppercase;
    `,
    lightCaps02: `
      ${SANS_LIGHT}
      ${lin('font-size', 18, 20)}
      text-transform: uppercase;
    `,
    body01: `
      ${SANS_LIGHT}
      ${lin('font-size', 20, 25)}
      line-height: 1.2;
      letter-spacing: -0.016em;
    `,
    body02: `
      ${SANS_LIGHT}
      font-size: 16px;
      line-height: 1.2;
      letter-spacing: -0.016em;
    `,
    body03: `
      ${SANS_LIGHT}
      font-size: 14px;
      line-height: 1.2;
      letter-spacing: -0.016em;
    `
  },
  ease,
  size: {
    gutter: (cssProp) => rs(cssProp, ['20px', null, '24px']),
    containerMargin: (cssProp) => rs(cssProp, ['20px', null, '5.3vw']),
    negativeContainerMargin: (cssProp) => rs(cssProp, ['-20px', null, '-5.3vw']),
    containerMarginMinusGutter: (cssProp) => rs(cssProp, ['calc(20px - 19.9px)', null, 'calc(5.3vw - 24px)']),
    containerWideMargin: (cssProp) => rs(cssProp, ['20px', null, '43px']),
    xs: (cssProp) => lin(cssProp, 10, 10),
    s: (cssProp) => lin(cssProp, 14, 20),
    m: (cssProp) => lin(cssProp, S.s9, S.s10),
    l: (cssProp) => lin(cssProp, S.s10, S.s11),
    xl: (cssProp) => lin(cssProp, S.s12, S.s13),
    menuBarHeight: (cssProp) => rs(cssProp, ['70px', null, '105px'])
  },
  boxShadow: {
    default: '0 2px 4px rgba(0, 0, 0, 0.04)'
  },
  timing: {
    modalAnimation: 300
  },
  imageAspectRatios: {
    portrait: 0.7,
    landscape: 1.3
  },
  utils: {
    focusVisible: 'box-shadow: 0px 0px 0px 3px blue;'
  }
}

// const tw = (string) => {
//   const utils = {
//     'focus-visible': ''
//   }
//   return string[0]
//     .split(' ')
//     .map((word) => utils[word])
//     .join(' ')
// }

export { theme, mq, lin, rs, breakpoints }
