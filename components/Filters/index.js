import React, { useEffect, useState } from 'react'
import Modal from '../Modal'
import styled from '@emotion/styled'
import { theme } from '@theme'
import Accordion from '@/components/Accordion'
import { ButtonPrimary, ButtonSecondary } from '@button'
import SwtachDot from '@/components/SwatchDot'
import { useSettings } from '@/hooks/Settings'

const Body = styled.form`
  position: relative;
`
const Footer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  ${theme.size.s('grid-column-gap')}
  ${theme.size.s('padding')}
border-top: 1px solid ${theme.colors.mono100};
`

const StyledSelectable = styled.div`
  display: flex;
  input {
    appearance: none;
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
  }
  label {
    ${theme.font.caps07}
    cursor: pointer;
    padding: 4px;
    display: inline-flex;
    align-items: center;
    &:hover {
      color: ${theme.colors.mono700};
    }
    div + span {
      margin-left: 4px;
    }
    span {
      border-bottom: 1px solid transparent;
      ${(props) => (props.checked ? 'border-color: currentColor;' : 'font-weight: 300;')}
    }
  }
  ${(props) =>
    props.presentation === 'size'
      ? `
  display: inline-block;
  label {
    padding-left: 24px;
    padding-right: 24px;
  }
`
      : ``}
  ${(props) =>
    props.presentation === 'color'
      ? `

`
      : ``}
`

const Selectable = ({ checked, label, value, id, onChange, presentation }) => {
  const { filteringColors } = useSettings()
  return (
    <StyledSelectable checked={checked} presentation={presentation}>
      <input type={'checkbox'} id={id} value={value} checked={checked} onChange={onChange} />
      <label htmlFor={id}>
        {presentation === 'color' && (
          <SwtachDot isCurrent={checked} swatchName={'color-' + value} swatchMap={filteringColors} isSmall />
        )}
        <span>{label}</span>
      </label>
    </StyledSelectable>
  )
}

const MultiSelect = styled.div`
  ${(props) =>
    props.presentation === 'color'
      ? `
display: grid;
grid-template-columns: repeat(3, 1fr);
`
      : ``}
`

const Filters = ({
  filters,
  onSubmit,
  onClear,
  onChange,
  resultsCount,
  activeFilters = [],
  setActiveFilters,
  ...props
}) => {
  const handleOptionClick = (filterID, optionID) => {
    let clickedFilter = activeFilters.find((f) => f?.id === filterID) ?? null
    let restFilters = activeFilters.filter((f) => f?.id !== filterID) ?? null
    let newFilters = []

    if (clickedFilter) {
      // filter that user clicked is in state
      if (clickedFilter.selectedOptions.includes(optionID)) {
        // option in filter that user clicked is in state
        if (clickedFilter.selectedOptions.length > 1) {
          // filter that user clicked has more than 1 options in state
          clickedFilter = {
            id: filterID,
            selectedOptions: clickedFilter.selectedOptions.filter((v) => v !== optionID)
          }
        } else {
          // option that user clicked is the only one in filter in state
          clickedFilter = null
        }
      } else {
        // option in filter that user clicked isn't in state
        if (filterID === 'sort') {
          clickedFilter.selectedOptions = [optionID]
        } else {
          clickedFilter.selectedOptions.push(optionID)
        }
      }
    } else {
      // filter that user clicked doesn't already exist
      clickedFilter = { id: filterID, selectedOptions: [optionID] }
    }

    if (clickedFilter) {
      newFilters.push(clickedFilter)
    }
    if (restFilters) {
      newFilters.push(...restFilters)
    }

    setActiveFilters(newFilters)
    onChange(newFilters)
  }

  return (
    <Modal
      {...props}
      footer={
        <Footer>
          <ButtonPrimary
            onClick={() => {
              props.onRequestClose()
            }}
          >
            {resultsCount > 1 ? `Show ${resultsCount} results` : resultsCount === 1 ? 'Show one result' : 'No results'}
          </ButtonPrimary>
          <ButtonSecondary
            disabled={!(activeFilters.length > 0)}
            onClick={() => {
              setActiveFilters([])
              onChange([])
            }}
          >
            Clear all
          </ButtonSecondary>
        </Footer>
      }
    >
      <Body onSubmit={(e) => onSubmit(e, activeFilters)}>
        {filters.map((f) => {
          const activeFiltersCount = activeFilters && activeFilters.find((a) => a.id === f.id)?.selectedOptions.length
          return (
            <Accordion
              title={f.label + (activeFiltersCount && f.id !== 'sort' ? ` (${activeFiltersCount}) ` : ``)}
              key={f.id}
              hasSidePaddings
            >
              <MultiSelect presentation={f.id}>
                {f.options.map((o) => {
                  return (
                    <Selectable
                      label={o.label}
                      key={f.id + o.id}
                      value={o.id}
                      id={f.id + o.id}
                      checked={
                        !!(
                          activeFilters &&
                          activeFilters
                            .find((activeFilter) => activeFilter?.id === f.id)
                            ?.selectedOptions.includes(o.id)
                        )
                      }
                      onChange={() => handleOptionClick(f.id, o.id)}
                      presentation={f.id}
                    />
                  )
                })}
              </MultiSelect>
            </Accordion>
          )
        })}
      </Body>
    </Modal>
  )
}

export default Filters
