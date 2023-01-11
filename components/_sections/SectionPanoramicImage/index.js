import React from 'react'
import styled from '@emotion/styled'
import RichText from '@/components/RichText'
import Container from '@/components/Container'

const Root = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 800px;
`
const SectionJournalText = ({ content }) => {
  return (
    <Container>
      <Root>
        <RichText json={content.json} />
      </Root>
    </Container>
  )
}

export default SectionJournalText
