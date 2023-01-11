import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import useCartModifier from '@/data/shopify/useCartModifier'

import ProductTabs from './ProductTabs'

import ProductPrice from '../ProductPrice'
import ColorSwitcher from './ColorSwitcher'

import { mq, theme } from '@theme'
import styled from '@emotion/styled'

import { useUI } from '@/hooks/UI'
import Modal from '../Modal'
import Button, { ButtonBlock, ButtonPrimary, ButtonSecondary } from '@button'
import OptionsPicker from './OptionsPicker'
import WaitlistForm from '../WaitlistForm'
import ProductIcons from './ProductIcons'
import { Price } from '../LineItemPrice'
import getBadgesFromProductTags from '../../helpers/getBadgesFromProductTags'
import { FitLoader } from '../PageLoader'
import { useAnalytics } from '@/hooks/Analytics'
import { useSettings } from '@/hooks/Settings'
import Image from '@image'
import Link from '@/components/Link'

const TitleWrap = styled.div`
  display: grid;
  ${theme.size.xs('grid-row-gap')}
  align-content: start;
`
const Title = styled.h1`
  ${theme.font.caps04}
  white-space: wrap;
`

const PriceWrapper = styled.div`
  ${theme.font.body01}
  s {
    color: ${theme.colors.mono500};
  }
  display: flex;
  align-items: center;
`
const BundleMessage = styled.div`
  ${theme.font.lightCaps01}
  margin-left: 1em;
`

const AddWrap = styled.div`
  display: grid;
  ${mq['lg']} {
    ${(props) =>
      props.isSticky
        ? `
    position: sticky;
    ${theme.size.xs('bottom')}
    z-index: 1;
  `
        : 'position: relative;'}
  }
`
const AddToBagButton = (props) => (
  <AddWrap isSticky={props.isSticky}>
    <ButtonPrimary {...props}>{props.isLoading ? <FitLoader r={'30px'} /> : props.children}</ButtonPrimary>
  </AddWrap>
)

const Root = styled.div`
  ${theme.size.m('padding-top')}
  ${mq['lg']} {
    min-height: 100vh;
    ${theme.size.m('padding-left')}
    ${theme.size.m('padding-right')}
  padding-top: 0;
  }
`
const Inner = styled.div`
  display: grid;
  grid-row-gap: 24px;
`

const FinalSale = styled.div`
  ${theme.font.lightCaps01}
  color: ${theme.colors.red};
  margin-left: 1em;
`
const Badge = styled.span`
  ${theme.font.caps07}
  background: black;
  color: white;
  padding: 4px 10px;
`

const QuadPay = styled.div`
  ${theme.font.lightCaps01}
  margin-bottom: 4px;
  margin-top: -8px;
  a {
    text-decoration: underline;
  }
`
const ColorTitle = styled.div`
  ${theme.font.lightCaps01}
`

const PreorderInfo = styled.div`
  ${theme.font.body02}
  color: ${theme.colors.mono700};
`

const Badges = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
  grid-auto-flow: column;
  ${mq['lg']} {
    position: relative;
  }
`

const Header = styled.div`
  display: grid;
  ${(p) => (p.hasImage ? 'grid-template-columns: 100px auto;' : '')}
  ${theme.size.s('grid-gap')}
`

const RelatedProductsWrap = styled.div``

const ProductDetails = ({ product, callbackOnAdd, isInQuickBuy }) => {
  const Analytics = useAnalytics()
  const globalSettings = useSettings()
  const isBundle = product.bundlePieces?.length > 1

  const { openCart } = useUI()
  const cartModifier = useCartModifier({ products: [...(isBundle ? product.bundlePieces : [product])] })

  const [isJoinTheWaitlistOpen, setJoinTheWaitlistOpen] = useState(false)

  const [selectedOptions, setSelectedOptions] = useState([])
  const [erroredOptions, setErroredOptions] = useState([])
  const [selectedProductVariants, setSelectedProductVariants] = useState(
    isBundle
      ? product.bundlePieces.map((piece) => ({ productId: piece.id }))
      : [
          {
            productId: product.id
          }
        ]
    // []
  )

  const [addToBagLabel, setAddToBagLabel] = useState(null)
  const [isAddToBagDisabled, setAddToBagDisabled] = useState(false)

  const isSingleProductWaitlistable =
    !isBundle && selectedProductVariants[0]?.variant && !selectedProductVariants[0].variant.available

  const isSingleProductPreorderable =
    !isBundle && selectedProductVariants[0]?.variant && selectedProductVariants[0].variant.currentlyNotInStock

  const badges = getBadgesFromProductTags(product.tags)

  const _variantPrices = product.variants.map((v) => parseInt(v.price.amount))
  const ifVariantsHaveDifferentPrices = !_variantPrices.every((val, i, arr) => val === arr[0])
  const lowestPriceVariant = ifVariantsHaveDifferentPrices
    ? product.variants[_variantPrices.findIndex((e) => e === Math.min(..._variantPrices))]
    : null

  const computedPrice = isBundle
    ? product.price
    : ifVariantsHaveDifferentPrices
    ? selectedProductVariants[0].variant
      ? selectedProductVariants[0].variant?.price
      : lowestPriceVariant.price
    : product.price

  const computedCompareAtPrice = isBundle
    ? product.compareAtPrice
    : ifVariantsHaveDifferentPrices
    ? selectedProductVariants[0].variant
      ? selectedProductVariants[0].variant?.compareAtPrice
      : lowestPriceVariant.compareAtPrice
    : product.compareAtPrice

  useEffect(() => {
    Analytics.productViewDetails(product)
  }, [])

  useEffect(() => {
    if (product.variants.length === 1 && !product.bundlePieces) {
      setSelectedProductVariants([
        {
          productId: product.id,
          variant: product.variants[0]
        }
      ])

      // setSelectedVariant(product.variants[0])
    }
  }, [product.handle])

  const showAlertNotification = (message) => {
    alert(message)
  }

  const isProductOptionValid = (productId, optionName) => {
    let newErrors = erroredOptions.map((p) => {
      if (p.productId === productId) {
        return {
          ...p,
          options: p.options.filter((o) => o !== optionName)
        }
      } else {
        return p
      }
    })
    setErroredOptions(newErrors)

    return newErrors.every((p) => p.options?.length === 0)
  }

  const onOptionsPickerChange = (productId, optionName, optionValue) => {
    if (isProductOptionValid(productId, optionName)) {
      setAddToBagDisabled(false)
    }
    setAddToBagLabel(null)

    // set selected options of variant

    let newSelectedOptions = [...selectedOptions]

    let changedProduct = newSelectedOptions.find((p) => p.productId === productId)

    if (!changedProduct) {
      newSelectedOptions.push({
        productId: productId,
        options: [
          {
            name: optionName,
            value: optionValue
          }
        ]
      })
    } else {
      const _changedOption = changedProduct.options.find((o) => o.name === optionName)
      if (!_changedOption) {
        changedProduct.options.push({
          name: optionName,
          value: optionValue
        })
      } else {
        _changedOption.value = optionValue
      }
    }

    setSelectedOptions(newSelectedOptions)

    // set picked variant

    let currentProductSelectedOptions = newSelectedOptions.find((p) => p.productId === productId)?.options
    let currentProduct = isBundle ? product.bundlePieces.find((p) => p.id === productId) : product

    if (currentProductSelectedOptions.length === currentProduct.optionsToSelect.length) {
      // find variant by newSelectedOptions

      const pickedVariant = currentProduct.variants.find((v) => {
        let found = false
        let testedOptions = []
        currentProductSelectedOptions.forEach((_selectedOption) => {
          let variantOptionValue = v.selectedOptions.find((o) => o.name === _selectedOption.name)?.value
          if (variantOptionValue === _selectedOption.value) {
            testedOptions.push(true)
          } else {
            testedOptions.push(false)
          }
        })
        if (testedOptions.every((e) => e)) {
          found = true
        }
        return found
      })

      if (!pickedVariant) {
        console.log('Selected variant not found')
      }

      let newSelectedVariants = selectedProductVariants.map((selectedProductVariant) => {
        if (selectedProductVariant.productId === productId) {
          return {
            productId: productId,
            variant: pickedVariant
          }
        } else {
          return selectedProductVariant
        }
      })

      setSelectedProductVariants(newSelectedVariants)
    }
  }

  const setValidationErrors = () => {
    let newErrors = []

    const _products = isBundle ? product.bundlePieces : [product]

    _products.forEach((bundlePiece) => {
      bundlePiece.optionsToSelect.forEach((optionToSelect) => {
        if (
          !selectedOptions
            .find((e) => e.productId === bundlePiece.id)
            ?.options.some((e) => e.name === optionToSelect.name)
        ) {
          const currentPieceInErrors = newErrors.find((e) => e.productId === bundlePiece.id)

          if (!currentPieceInErrors) {
            newErrors.push({
              productId: bundlePiece.id,
              options: [optionToSelect.name]
            })
          } else {
            if (!currentPieceInErrors.options.includes(optionToSelect.name)) {
              currentPieceInErrors.options.push(optionToSelect.name)
            }
          }
        }
      })
    })
    setErroredOptions(newErrors)
    return newErrors.length === 0
  }

  const addToBagSelectedProductVariants = () => {
    const _variants = selectedProductVariants.map((p) => p.variant)
    let customAttributes = []
    if (selectedProductVariants.length > 1) {
      customAttributes = [
        { key: '_set_discount', value: product.bundleDiscount ?? '' },
        {
          key: '_set_handle',
          value: _variants
            .map((v) => v.id)
            .sort()
            .join()
        },
        { key: '_set_title', value: product.title }
      ]
    }
    if (isSingleProductPreorderable) {
      customAttributes = [
        { key: 'ships_on', value: product.preorderInfo ?? 'Preorder' },
        { key: '_is_preorder', value: 'true' }
      ]
    }

    if (callbackOnAdd) callbackOnAdd()
    setTimeout(() => openCart(), 300)

    cartModifier.add(_variants, customAttributes).then((response) => {
      if (response.isPartiallyUpdated) {
        console.log(response)
        showAlertNotification(
          "We're sorry, but unfortunately we can't add this product to the bag. It was either just bought by another customer or you already have maximum available quantity in the bag."
        )
      } else {
        Analytics.addToCart(response.variants)
        console.log('response', response)
      }
    })
  }

  return (
    <Inner>
      <Header hasImage={isInQuickBuy}>
        {isInQuickBuy && (
          <ButtonBlock href={'/products/' + product.handle} tabIndex={-1}>
            <Image image={product.primaryImage} sizes={'100px'} />
          </ButtonBlock>
        )}

        <TitleWrap>
          {badges.length > 0 && (
            <Badges>
              {badges.map((b, i) => (
                <Badge key={i}>{b}</Badge>
              ))}
            </Badges>
          )}
          {isInQuickBuy ? (
            <Link href={'/products/' + product.handle}>
              <Title>{product.title}</Title>
            </Link>
          ) : (
            <Title>{product.title}</Title>
          )}

          <PriceWrapper>
            <div>
              {computedPrice ? (
                <ProductPrice
                  price={computedPrice}
                  compareAtPrice={computedCompareAtPrice}
                  showFromLabel={ifVariantsHaveDifferentPrices && !selectedProductVariants[0].variant}
                />
              ) : (
                <>&nbsp;</>
              )}
            </div>
            {product.tags.includes('final-sale') && <FinalSale>Final sale</FinalSale>}
            {product.bundleMessage && <BundleMessage>{product.bundleMessage}</BundleMessage>}
          </PriceWrapper>
        </TitleWrap>
      </Header>

      {product.relatedProducts.length > 1 && (
        <ColorSwitcher isInQuickBuy={isInQuickBuy} product={product} productColors={globalSettings.productColors} />
      )}
      {product.relatedProducts.length === 1 && product.color && <ColorTitle>Color: {product.color}</ColorTitle>}

      {isBundle
        ? product.bundlePieces.map((bundlePiece) => {
            return (
              <OptionsPicker
                product={bundlePiece}
                selectedOptions={selectedOptions}
                erroredOptions={erroredOptions}
                onChange={onOptionsPickerChange}
                key={'OptionsPicker_' + bundlePiece.id}
                isBundlePiece
                productColors={globalSettings.productColors}
              />
            )
          })
        : product.optionsToSelect.length > 0 && (
            <OptionsPicker
              product={product}
              selectedOptions={selectedOptions}
              erroredOptions={erroredOptions}
              onChange={onOptionsPickerChange}
            />
          )}

      {isSingleProductPreorderable && <PreorderInfo>{product.preorderInfo ?? 'Preorder'}</PreorderInfo>}

      <AddToBagButton
        isLoading={cartModifier && cartModifier.isProcessing}
        disabled={(cartModifier && cartModifier.isProcessing) || isAddToBagDisabled}
        onClick={() => {
          if (!setValidationErrors()) {
            setAddToBagDisabled(true)
            return
          }

          if (isBundle) {
            if (selectedProductVariants.map((p) => p.variant.available).every((e) => e)) {
              // every piece is available
              addToBagSelectedProductVariants()
            } else {
              setAddToBagLabel('Size is not available')
            }
          } else {
            if (isSingleProductWaitlistable) {
              setJoinTheWaitlistOpen(true)
            } else {
              addToBagSelectedProductVariants()
            }
          }
        }}
        onMouseOver={() => {
          if (!isBundle) {
            if (!selectedProductVariants[0]) {
              setAddToBagLabel('Select a size')
            }
          }
        }}
        onMouseOut={() => {
          if (!isBundle) {
            if (selectedProductVariants[0]) {
              setAddToBagLabel(null)
            }
          }
        }}
        isSticky={isBundle}
      >
        {addToBagLabel ?? isSingleProductWaitlistable
          ? 'Join the waitlist'
          : isSingleProductPreorderable
          ? 'Preorder'
          : 'Add to bag'}
      </AddToBagButton>

      <QuadPay>
        Or 4 interest-free payments of <Price price={parseFloat(product.price.amount) / 4} /> by Quadpay.
      </QuadPay>

      <ProductTabs product={product} isBundle={isBundle} globalSettings={globalSettings} />
      <ProductIcons icons={product.tags.filter((t) => t.startsWith('icon-'))} iconsMap={globalSettings.productIcons} />

      <Modal
        isOpen={isJoinTheWaitlistOpen}
        onRequestClose={() => setJoinTheWaitlistOpen(false)}
        title={'Join the waitlist'}
      >
        <WaitlistForm
          variant={selectedProductVariants[0]?.variant ?? null}
          title={product.title}
          isOneSize={false}
          onDismiss={() => {
            setJoinTheWaitlistOpen(false)
          }}
        />
      </Modal>
    </Inner>
  )
}

ProductDetails.propTypes = {
  product: PropTypes.object.isRequired
}

export default ProductDetails
