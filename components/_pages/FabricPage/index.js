import React, { useState } from 'react'
import styled from '@emotion/styled'
import { theme, mq } from '@theme'
import Image from '@image'
import Button from '@button'
import ProductGrid from '../../ProductGrid'
import FabricGrid from './FabricGrid'
import SectionImageText from '../../_sections/SectionImageText'

const PageTitle = styled.div`
  ${theme.size.menuBarHeight('margin-top')}
  ${theme.size.m('margin-bottom')}
  ${theme.size.m('padding-top')}
  ${theme.size.containerMargin('padding-left')}
  ${theme.size.containerMargin('padding-right')}
  ${theme.font.caps03}
`
const Root = styled.div`
  display: grid;
  ${theme.size.xl('grid-row-gap')}
`

const HeroOverlay = styled.div`
  position: absolute;
  ${theme.size.containerMargin('left')}
  ${theme.size.containerMargin('right')}
${theme.size.l('padding-top')}
top: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const Hero = styled.div`
  position: relative;
`
const HeroFabric = styled.div`
  position: relative;
  a {
    ${theme.font.caps04}
    color: white;
    opacity: 0.65;
    padding: 0.25em 0;
    transition: opacity 200ms;
    ${(p) => (p.isActive ? `opacity: 1; text-decoration: underline;` : ``)}
  }
`
const SectionsWrap = styled.div`
  display: grid;
  ${theme.size.gutter('grid-row-gap')}
`
const FabricPage = ({ fabric, allFabrics }) => {
  const [activeFabricIndex, setActiveFabricIndex] = useState(-1)
  return (
    <Root>
      <Hero>
        <PageTitle>Fabric</PageTitle>
        <div style={{ position: 'relative' }}>
          <div className={'hide-on-mobile'}>
            <Image image={fabric.image} />
          </div>
          <div className={'hide-on-desktop'}>
            <Image image={fabric.imageMobile} />
          </div>
          <HeroOverlay>
            {allFabrics.map((f, i) => {
              return (
                <HeroFabric
                  key={i}
                  isActive={(activeFabricIndex < 0 && f.slug === fabric.slug) || i === activeFabricIndex}
                >
                  <Button
                    href={'/fabrics/' + f.slug}
                    scroll={false}
                    onMouseEnter={() => {
                      setActiveFabricIndex(i)
                    }}
                    onMouseLeave={() => setActiveFabricIndex(-1)}
                  >
                    {f.name}
                  </Button>
                </HeroFabric>
              )
            })}
          </HeroOverlay>
        </div>
      </Hero>
      {fabric.sectionsCollection && (
        <SectionsWrap>
          {fabric.sectionsCollection.items.map((s, i) => {
            return <SectionImageText key={i} {...s} />
          })}
        </SectionsWrap>
      )}
      <ProductGrid products={fabric.products} columns={3} title={'Related Items'} />

      <FabricGrid fabrics={allFabrics} />
    </Root>
  )
}

export default FabricPage
