import React from 'react'
import styled from '@emotion/styled'
import { theme } from '@theme'
import IconArrow from '@/components/_icons/IconArrow'
import { ButtonRaw } from '@button'

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  ${theme.size.l('margin-top')}
`

const ButtonInner = styled.div`
  ${theme.font.caps07}
  display: flex;
  align-items: center;
  margin: 0 0.5em;
  svg {
    fill: currentColor;
  }
  ${(props) =>
    props.isNext
      ? `
svg {transform: rotate(-90deg);}
`
      : `svg {transform: rotate(90deg);}`}
  padding: 4px;
`

const Label = styled.div`
  ${theme.font.caps07}
  margin: 0 0.25em;
`
const Of = styled.div`
  ${theme.font.caps07}
`
const PaginationControls = ({ onNextClick, onPreviousClick, pagesCount, currentPage }) => {
  return (
    pagesCount > 1 && (
      <Root>
        <ButtonRaw onClick={onPreviousClick} disabled={currentPage === 1}>
          <ButtonInner>
            <IconArrow /> prev
          </ButtonInner>
        </ButtonRaw>

        <Label>
          Page {currentPage} of {pagesCount}
        </Label>

        <ButtonRaw onClick={onNextClick} disabled={currentPage === pagesCount}>
          <ButtonInner isNext>
            Next <IconArrow />
          </ButtonInner>
        </ButtonRaw>
      </Root>
    )
  )
}

export default PaginationControls
