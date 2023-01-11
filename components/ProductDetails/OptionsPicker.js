import React, { useState } from 'react'

import { ButtonOutline } from '@button'

import { theme } from '@theme'
import styled from '@emotion/styled'
import Modal from '@/components/Modal'
import Image from '@image'
import { ButtonRaw } from '@button'
import SwtachDot from '@/components/SwatchDot'

const RadioGroup = styled.div`
  margin-bottom: -12px;
`

const Radio = styled.div`
  display: inline-flex;
  margin: 0 12px 12px 0;
  input {
    appearance: none;
    -webkit-appearance: none;
    width: 0;
    height: 0;
    border: 0;
    position: absolute;
  }

  label {
    user-select: none;
    border: 1px solid ${theme.colors.mono300};
    ${theme.font.caps07}
    padding: 0 16px;
    cursor: pointer;
    height: 44px;
    min-width: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 200ms;
    box-sizing: border-box;
  }
  input:checked + label {
    background-color: black;
    color: white;
    border-color: black;
  }
  input:not(:disabled) + label {
    @media (hover: hover) and (pointer: fine) {
      &:hover {
        border-color: black;
      }
    }
  }
  input:disabled + label {
    cursor: not-allowed;
  }

  ${(props) =>
    props.isSoldOut
      ? `
color: ${theme.colors.mono400};
label {
  border-color: ${theme.colors.mono200};
}
`
      : ''}
`

const ModalInner = styled.div`
  ${theme.size.s('padding')}
  position: relative;
  overflow-y: auto;
`

const Root = styled.div`
  display: grid;
  ${theme.size.s('grid-gap')}
  ${(props) =>
    props.isBundlePiece
      ? `
grid-template-columns: 80px 1fr;
`
      : ``}
`

const OptionTitleWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`

const OptionTitle = styled.div`
  ${theme.font.lightCaps01}
  color: ${(props) => (props.hasError ? theme.colors.red : 'black')};
`

const ProductTitle = styled.div`
  ${theme.font.caps07}
`
const Content = styled.div`
  display: grid;
  ${theme.size.s('grid-row-gap')}
`
const ColorWrap = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  ${theme.size.s('grid-column-gap')}
  align-items: center;
  ${theme.font.lightCaps01}
`

const OptionsPicker = ({ product, selectedOptions, erroredOptions, onChange, isBundlePiece, productColors }) => {
  const [isModalOpen, setModalOpen] = useState(false)

  const productId = product.id

  const isSizeVariantAvailable = (size) => {
    if (product.productType === 'Gift Card') {
      return true
    }

    if (product.optionsToSelect.length === 2) {
      const selectedLength = selectedOptions
        .find((e) => e.productId === productId)
        ?.options.find((o) => o.name === 'LENGTH')?.value

      if (!selectedLength) {
        return true
      } else {
        return product.variants.find((v) => {
          let found = false
          let testedOptions = [
            v.selectedOptions.find((o) => o.name === 'LENGTH').value === selectedLength,
            v.selectedOptions.find((o) => o.name === 'Size').value === size
          ]
          if (testedOptions.every((e) => e)) {
            found = true
          }
          return found
        })?.available
      }
    } else {
      return product.variants.find((v) => v.selectedOptions.find((o) => o.name === 'Size')?.value === size)?.available
    }
  }

  return (
    <Root isBundlePiece={isBundlePiece}>
      {isBundlePiece && (
        <div>
          <Image image={product.primaryImage} sizes={'80px'} />
        </div>
      )}

      <Content>
        {isBundlePiece && (
          <>
            <ProductTitle>
              <ButtonRaw href={'/products/' + product.handle}>{product.title}</ButtonRaw>
            </ProductTitle>
            <ColorWrap>
              <SwtachDot selected swatchMap={productColors} swatchName={product.color} />
              {product.color}
            </ColorWrap>
          </>
        )}

        {product.optionsToSelect.map((option, optionIndex) => {
          const keyOption = 'option_picker_' + productId + '_' + option.name
          return (
            <div key={keyOption}>
              <OptionTitleWrap>
                <OptionTitle
                  id={keyOption}
                  hasError={erroredOptions
                    .find((p) => p.productId === product.id)
                    ?.options.some((o) => o === option.name)}
                >
                  Select {option.name !== 'Title' ? option.name : 'Value'}
                </OptionTitle>
                {optionIndex === 0 && (
                  <ButtonOutline onClick={() => setModalOpen(true)}>Size & Fit Guide</ButtonOutline>
                )}
              </OptionTitleWrap>
              <RadioGroup role={'radiogroup'} aria-labelledby={keyOption}>
                {option.values.map((value) => {
                  const keyOptionValue = `${productId}_${option.name}_${value.id}`
                  const _checked = !!(
                    selectedOptions.find((e) => e.productId === productId)?.options.find((o) => o.name === option.name)
                      ?.value === value.id
                  )

                  const isSoldOut = !isSizeVariantAvailable(value.id)
                  return (
                    <Radio key={keyOptionValue} isSoldOut={option.name === 'Size' && isSoldOut}>
                      <input
                        type={'radio'}
                        id={keyOptionValue}
                        value={value.id}
                        name={productId + option.name}
                        onChange={() => onChange(productId, option.name, value.id)}
                        aria-checked={_checked}
                        checked={_checked}
                        disabled={isBundlePiece && option.name === 'Size' && isSoldOut}
                      />
                      <label htmlFor={keyOptionValue}>{value.title}</label>
                    </Radio>
                  )
                })}
              </RadioGroup>
            </div>
          )
        })}
      </Content>

      <Modal isOpen={isModalOpen} onRequestClose={() => setModalOpen(false)} title={'Size & Fit Guide'} isWide>
        <ModalInner>
          <Image
            image={{
              src: 'https://splits59.com/img/size_chart.png',
              width: 1700,
              height: 2088
            }}
            sizes={`50vw`}
          />
        </ModalInner>
      </Modal>
    </Root>
  )
}

export default OptionsPicker
