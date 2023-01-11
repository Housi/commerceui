import React, { useState } from 'react'
import styled from '@emotion/styled'
import { theme, mq } from '@theme'
import JournalCard from '@/components/JournalCard'
import Container from '@/components/Container'
import Image from '@image'
import SectionMaker from '@/components/_sections/SectionMaker'
import ProductGrid from '@/components/ProductGrid'

const Root = styled.div`
  display: grid;
  ${theme.size.xl('grid-gap')}
`

const Title = styled.h1`
  text-align: center;
  ${theme.font.caps02}
  padding: 0 1em;
`
const Lead = styled.p`
  ${theme.font.body01}
  text-align: center;
  margin-top: 1em;
  padding: 0 0.5em;
`
const Header = styled.div`
  max-width: 600px;
  margin: 0 auto;
`
const EntriesTitle = styled.div`
  ${theme.font.caps04}
  ${theme.size.m('margin-bottom')}
`
const EntriesGrid = styled.div`
  display: grid;
  ${theme.size.gutter('grid-column-gap')}
  ${theme.size.m('grid-row-gap')}
  ${mq['lg']} {
    grid-template-columns: 1fr 1fr;
  }
`
const JournalEntryPage = ({ title, lead, image, imageMobile, sections, relatedProducts, relatedEntries }) => {
  const _imageMobile = imageMobile ?? image
  return (
    <Root>
      <div className="hide-on-mobile">
        <Image image={image} sizes={'100vw'} priority />
      </div>
      <div className="hide-on-desktop">
        <Image image={_imageMobile} sizes={'100vw'} priority />
      </div>

      <Container>
        <Header>
          <Title>{title}</Title>
          {lead && <Lead>{lead}</Lead>}
        </Header>
      </Container>
      {sections && sections.length > 0 && sections.map((section, i) => <SectionMaker {...section} key={i} />)}
      {relatedProducts && relatedProducts.length > 0 && (
        <ProductGrid products={relatedProducts} columns={3} title={'Related Items'} />
      )}
      {relatedEntries && relatedEntries.length > 0 && (
        <Container>
          <EntriesTitle>More Journals</EntriesTitle>
          <EntriesGrid>
            {relatedEntries.map((entry, i) => (
              <JournalCard {...entry} key={i} />
            ))}
          </EntriesGrid>
        </Container>
      )}
    </Root>
  )
}

export default JournalEntryPage
