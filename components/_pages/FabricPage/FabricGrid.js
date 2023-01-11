import React from 'react'
import styled from '@emotion/styled'
import Image from '@image'
import { theme, mq } from '@theme'
import { ButtonBlock } from '@button'
import Container from '@/components/Container'

const Root = styled.div`
  display: grid;
  ${theme.size.gutter('grid-gap')}
  grid-template-columns: repeat(2, 1fr);
  ${mq['md']} {
    grid-template-columns: repeat(4, 1fr);
  }
  ${mq['lg']} {
    grid-template-columns: repeat(8, 1fr);
  }
`
const Title = styled.div`
  ${theme.font.caps04}
  ${theme.size.m('margin-bottom')}
`
const CardTitle = styled.div`
  text-align: center;
  ${theme.font.caps07}
  ${theme.size.s('margin-top')}
`
const Inner = styled.div`
  display: block;
`

const FabricGrid = ({ fabrics }) => {
  return (
    <Container>
      <Title>Learn more fabrics</Title>
      <Root>
        {fabrics.map((f, i) => {
          return (
            <ButtonBlock href={'/fabrics/' + f.slug} key={i}>
              <Inner>
                <Image image={f.imageMobile} sizes={'200px'} />
                <CardTitle>{f.name}</CardTitle>
              </Inner>
            </ButtonBlock>
          )
        })}
      </Root>
    </Container>
  )
}

export default FabricGrid
