import React from 'react'
import styled from '@emotion/styled'
import { theme, mq } from '@theme'

import Container from '@/components/Container'
import Newsletter from '@/components/Newsletter'

const Root = styled.div`
  ${theme.size.xl('margin-top')}
  ${theme.size.xl('margin-bottom')}
`
const Grid = styled.div`
  position: relative;
  ${mq['lg']} {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    & > div {
      grid-column: 2 / span 2;
    }
  }
`

const SectionNewsletterForm = () => {
  return (
    <Root>
      <Container>
        <Grid>
          <div>
            <Newsletter />
          </div>
        </Grid>
      </Container>
    </Root>
  )
}

export default SectionNewsletterForm
