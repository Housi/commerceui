import styledBox from "../../styledBox";
import {useEffect, useRef} from "react";
import React from "react";
import Link from "@link"
const NavInner = styledBox({
  display: [
    'grid',
    null,
    null,
    'block'
  ],
  gridAutoColumns: 'min-content',
  gridAutoFlow: 'column',
  "::-webkit-scrollbar": {display: 'none'},
  overflowX: [
    'auto',
    null,
    null,
    'visible'
  ],
  ":before, :after" : {
    content: "''",
    display: [
      'block',
      null,
      null,
      'none'
    ],
    width: [
      "containerMargin",
    ]
  }
});
const NavItemWrapper = styledBox({
  color: props => props.active ? 'black' : 'mono500',
  font: 'heading01',
  position: 'relative',
  whiteSpace: 'nowrap',
  mr: 's7'
})
const Root = styledBox({position: 'relative'})
const GradientLeft = styledBox({
  left: 0, top: 0, width: 30, height: '100%',
  position: 'absolute', pointerEvents: 'none',
  background: "linear-gradient(270deg, rgba(252,250,247,0) 0%, rgba(252,250,247,1) 100%)",
  display: [
    null,
    null,
    null,
    'none'
  ]
})
const GradientRight = styledBox({
  right: 0, top: 0, width: 30, height: '100%',
  position: 'absolute', pointerEvents: 'none',
  background: "linear-gradient(90deg, rgba(252,250,247,0) 0%, rgba(252,250,247,1) 100%)",
  display: [
    null,
    null,
    null,
    'none'
  ]
})
const NavItemIndicator = styledBox({
  display: props => [
    'none',
    null,
    null,
    props.active ? 'block' : 'none'
  ],
  position: 'absolute',
  width: 5, height: 5, bg: 'black',
  borderRadius: '50%',
  content: "'a'",
  top: '0.75em',
  left: '-1.5em',
  zIndex: 1
})

const HorizontalNav = ({nav, activeLabel, activeLabelSuffix}) => {
  const refNav = useRef(null);
  useEffect(() => {
    let node = refNav.current;
    if(node.querySelector('.active')) {
      node.scrollLeft = (node.querySelector('.active').offsetLeft - node.clientWidth / 2) + node.querySelector('.active').clientWidth / 2 + 12.5
    }
  });

  return <Root><NavInner ref={refNav} >
    {
      nav.map((item, i) => {
        let active = activeLabel === item.label;
        return <NavItemWrapper key={i} className={active ? 'active' : ''} active={active} >
          <Link href={item.href}>
            {/*{item.label} {active && activeLabelSuffix}*/}
          </Link>
          <NavItemIndicator active={active}/>
        </NavItemWrapper>
      })
    }
  </NavInner>
    <GradientLeft/>
    <GradientRight/>
  </Root>

}

export default HorizontalNav