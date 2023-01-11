import React, { useEffect, useState, useRef } from 'react'
import Router, { useRouter } from 'next/router'
import { filterCollection } from '@/data/shopify/fetchCollection'
import styled from '@emotion/styled'
import { theme, mq } from '@theme'

import CollectionGrid from '@/components/CollectionGrid'
import Container from '@/components/Container'
import Button, { ButtonRaw, ButtonBlock } from '@button'
import Filters from '@/components/Filters'

import PaginationControls from '@/components/PaginationControls'

import IconPlus from '@/components/_icons/IconPlus'
import IconMixedCols from '@/components/_icons/IconMixedCols'
import Icon2cols from '@/components/_icons/Icon2cols'
import Icon3cols from '@/components/_icons/Icon3cols'

import decomposeCollectionHandle from './decomposeCollectionHandle'
import buildCollectionHandle from './buildCollectionHandle'
import CollectionSeo from './CollectionSeo'
import { useUI } from '@/hooks/UI'

const NoProductsStyled = styled.div`
  margin-top: 200px;
  text-align: center;
  ${theme.font.caps07}
`
const NoProducts = () => <NoProductsStyled>There are no products matching selected criteria</NoProductsStyled>

const PageTitle = styled.h1`
  ${theme.font.caps03}
  ${theme.size.menuBarHeight('margin-top')}
${theme.size.l('padding-top')}
line-height: 1;
`

const Breadcrumbs = styled.div`
  display: flex;
`

const UtilsBar = styled.div`
  ${theme.font.caps07}
  ${theme.size.s('margin-top')}
${theme.size.s('margin-bottom')}
display: flex;
  justify-content: space-between;
  alignitems: center;
`

const ViewControls = styled.div`
  display: inline-grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  align-items: center;
  grid-column-gap: 10px;
  margin-right: -4px;
  button {
    line-height: 1 !important;
  }
  .hideOnMobile {
    display: none;
    ${mq['lg']} {
      display: block;
    }
  }
`

const IconWrap = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  svg {
    fill: ${(props) => (props.isActive ? theme.colors.mono900 : theme.colors.mono400)};
  }
`

const GridWrap = styled.div`
  position: relative;
  //transition: opacity 200ms;
  ${(p) => (p.isLoading ? 'display: none;' : '')}
`

const FiltersButtonInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 16px;
    height: 16px;
  }
  span {
    margin-right: 0.25em;
  }
`
const getActiveFiltersCount = (activeFilters) => {
  if (!activeFilters) {
    return 0
  }
  let counter = 0
  activeFilters.forEach((f) => {
    counter = counter + f.selectedOptions.length
  })
  return counter
}

const Collection = (props) => {
  const router = useRouter()
  const query = router.query
  const isFirstRender = useRef(true)

  const { lastClickedCollectionViewType, setLastClickedCollectionViewType } = useUI()

  const { handle, values } = decomposeCollectionHandle(query.handle)
  const fullHandle = buildCollectionHandle(handle, values)

  const [activeFilters, setActiveFilters] = useState(values?.filters ?? [])
  const [collection, setCollection] = useState(props.collection)
  const [pagination, setPagination] = useState(props.pagination)
  const [isFiltersOpen, setFiltersOpen] = useState(false)
  const [viewType, setViewType] = useState(
    props.editorialCollection ? 'MIXED' : lastClickedCollectionViewType ?? 'TWO_COLS'
  ) // MIXED, TWO_COLS, THREE_COLS
  const [isLoading, setLoading] = useState(false)

  const activeFiltersCount = getActiveFiltersCount(activeFilters)

  // console.log(viewType, lastClickedCollectionViewType, props.editorialCollection)
  const onChange = (newFilters) => {
    // TODO: potential performance gains:
    // Shallow routing rerenders entire app, and then useEffect makes another re-render, it's a lot of rerenders, we could try to  optimize this.

    setLoading(true)

    const newFullHandle = buildCollectionHandle(handle, { filters: newFilters })

    Router.push(`/collections/[handle]`, `/collections/${newFullHandle}`, {
      shallow: true
    })
    setLoading(false)
  }

  const changePage = (page) => {
    window.scrollTo(0, 0)
    const newFullHandle = buildCollectionHandle(handle, {
      ...values,
      page
    })

    Router.push(`/collections/[handle]`, `/collections/${newFullHandle}`, {
      shallow: true
    })
  }

  useEffect(() => {
    if (isFirstRender.current) {
      if (props.editorialCollection) {
        if (activeFiltersCount !== 0 && viewType === 'MIXED') {
          setViewType(
            lastClickedCollectionViewType
              ? lastClickedCollectionViewType === 'MIXED'
                ? 'TWO_COLS'
                : lastClickedCollectionViewType
              : 'TWO_COLS'
          )
        } else if (lastClickedCollectionViewType && lastClickedCollectionViewType !== 'MIXED') {
          setViewType(lastClickedCollectionViewType)
        }
      }
      isFirstRender.current = false
      return
    }
    setLoading(true)
    const result = filterCollection(props.fullCollection, { ...values })
    setTimeout(() => {
      setCollection(result.collection)
      setPagination(result.pagination)
      setActiveFilters(values.filters)
      setLoading(false)
    }, 100)
  }, [fullHandle]) // if query string changed, let's reload

  return (
    <div>
      {/*<pre style={{position: 'fixed', zIndex:10000, background: 'red'}}>*/}
      {/*      activeFilters: {JSON.stringify(activeFilters)} <br/>*/}
      {/*      values: {JSON.stringify(values)} <br/>*/}
      {/*      loading: {JSON.stringify(isLoading)}*/}
      {/*</pre>*/}
      <CollectionSeo fullCollection={props.fullCollection} />

      <Container>
        <PageTitle>{props.collection.title}</PageTitle>
        <UtilsBar>
          <Breadcrumbs>
            {[
              {
                label: 'Home',
                href: '/'
              },
              {
                label: props.collection.title,
                href: '/collections/' + props.collection.handle
              }
            ].map((item, i) => (
              <div key={i}>
                <Button href={item.href}>{item.label}</Button>
                {i === 0 && <span>&nbsp;/&nbsp;</span>}
              </div>
            ))}
          </Breadcrumbs>

          <ViewControls>
            <span className={'hideOnMobile'}>View:</span>
            {activeFiltersCount === 0 && props.editorialCollection && (
              <ButtonBlock
                onClick={() => {
                  setViewType('MIXED')
                  setLastClickedCollectionViewType('MIXED')
                }}
              >
                <IconWrap isActive={viewType === 'MIXED'}>
                  <IconMixedCols />
                </IconWrap>
              </ButtonBlock>
            )}
            <ButtonBlock
              onClick={() => {
                setViewType('TWO_COLS')
                setLastClickedCollectionViewType('TWO_COLS')
              }}
              className={!props.editorialCollection && 'hideOnMobile'}
            >
              <IconWrap isActive={viewType === 'TWO_COLS'}>
                <Icon2cols />
              </IconWrap>
            </ButtonBlock>
            <ButtonBlock
              onClick={() => {
                setViewType('THREE_COLS')
                setLastClickedCollectionViewType('THREE_COLS')
              }}
              className={'hideOnMobile'}
            >
              <IconWrap isActive={viewType === 'THREE_COLS'}>
                <Icon3cols />
              </IconWrap>
            </ButtonBlock>
            <Button onClick={() => setFiltersOpen(true)}>
              <FiltersButtonInner>
                <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
                <IconPlus />
              </FiltersButtonInner>
            </Button>
          </ViewControls>
        </UtilsBar>
      </Container>

      <GridWrap isLoading={isLoading}>
        {collection && collection.products.length > 0 ? (
          <CollectionGrid
            products={collection.products}
            viewType={viewType}
            collectionHandle={collection.handle}
            editorialCollection={props.editorialCollection}
          />
        ) : (
          <NoProducts />
        )}
      </GridWrap>

      {pagination.max > 1 && (
        <PaginationControls
          onNextClick={() => {
            changePage(pagination.current + 1)
          }}
          onPreviousClick={() => {
            changePage(pagination.current - 1)
          }}
          pagesCount={pagination.max}
          currentPage={pagination.current}
        />
      )}

      <Filters
        isOpen={isFiltersOpen}
        onRequestClose={() => setFiltersOpen(false)}
        title={'Filters'}
        filters={props.filters}
        onSubmit={(e, newFilters) => {
          if (e) {
            e.preventDefault()
          }
          setFiltersOpen(false)
          onChange(newFilters)
        }}
        onChange={(newFilters) => onChange(newFilters)}
        resultsCount={collection.products.length}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      />
    </div>
  )
}

export default Collection
