import fetchContentfulGraphQL from './fetchContentfulGraphQL'
import AssetFragment from './fragments/AssetFragment'

function extractGlobalSettings(response) {
  return response?.data?.globalSettings
}

const globalSettingsQuery = `
${AssetFragment}
query globalSettingsEntryQuery {
  globalSettings(id: "6wsTEgks22zGPG6jUxYhWP") {
    seoTitle
    seoDescription
    pageTitleSuffix
    openGraphSiteName
    openGraphDefaultImage { ...AssetFragment }
    promoBar {
      title
      href
      backgroundColor
    }
  }
}
`
const menuQuery = `
fragment LinkFragment on Link {
  title
  href
  openInNewTab
}
fragment TabFragment on GlobalSettingsMenuTab {
  title
  links: linksCollection (limit: 20) {
    items {
      ... LinkFragment
    }
  }
}
query globalSettingsMenuEntryQuery {
  globalSettingsMenu(id: "66sE5wYfc50xmvZpxgG90t") {
    tabs: tabsCollection (limit: 20) {
      items {
        __typename
        ... TabFragment
        ... LinkFragment
      }
    }
  }
}
`
const footerQuery = `
query globalSettingsFooterEntryQuery {
  globalSettingsFooter(id: "tE6Num8xBTvq4sklscfJi") {
    firstColumnLinks: firstColumnLinksCollection (limit: 20){
      items {
        title
        href
        openInNewTab
      }
    }
    secondColumnLinks: secondColumnLinksCollection (limit: 20){
      items {
        title
        href
        openInNewTab
      }
    }
  }
}
`
const productColorsQuery = `
${AssetFragment}
query productColorCollectionQuery {
  productColorCollection(limit: 300) {
    items {
      title
      hex
      image {
        ...AssetFragment
      }
    }
  }
}
`

const filteringColorsQuery = `
${AssetFragment}
query filteringColorCollectionQuery {
  filteringColorCollection(limit: 300) {
    items {
      title
      hex
      image {
        ...AssetFragment
      }
    }
  }
}
`
const productFabricsQuery = `
query fabricCollectionQuery {
  productFabricCollection(limit: 20) {
    items {
      title
      fabricTag
      content {
        json
      }
    }
  }
}
`
const productIconsQuery = `
${AssetFragment}
query productIconsQuery {
  productIconCollection(limit: 20) {
    items {
      title
      iconTag
      icon {
        ...AssetFragment
      }
    }
  }
}
`
const productSettingsQuery = `
query productSettingsQuery {
  productSettings (id: "7pkfRrqtv2qY7sZoIdsCs8") {
    iconsOrderCollection {
      items {
        iconTag
      }
    }
    shippingTabContent {
      json
    }
  }
}
`
const saleTagsQuery = `
query saleTagCollectionQuery {
  saleTagCollection {
    items {
      tag
      message
    }
  }
}
`
async function fetchGlobalSettings() {
  const responses = await Promise.all([
    fetchContentfulGraphQL(globalSettingsQuery),
    fetchContentfulGraphQL(menuQuery),
    fetchContentfulGraphQL(footerQuery),
    fetchContentfulGraphQL(productColorsQuery),
    fetchContentfulGraphQL(filteringColorsQuery),
    fetchContentfulGraphQL(productFabricsQuery),
    fetchContentfulGraphQL(productIconsQuery),
    fetchContentfulGraphQL(productSettingsQuery),
    fetchContentfulGraphQL(saleTagsQuery)
  ])

  // sort product icons

  const sortingOrder = responses[7].data.productSettings.iconsOrderCollection.items.map((i) => i.iconTag)
  let productIcons = responses[6].data.productIconCollection.items
  let sortedProductIcons = []

  sortingOrder.forEach((key) => {
    let found = false
    productIcons = productIcons.filter((item) => {
      if (!found && item.iconTag === key) {
        sortedProductIcons.push(item)
        found = true
        return false
      } else return true
    })
  })

  return {
    ...extractGlobalSettings(responses[0]),
    menu: responses[1].data.globalSettingsMenu,
    footer: responses[2].data.globalSettingsFooter,
    productColors: responses[3].data.productColorCollection.items,
    filteringColors: responses[4].data.filteringColorCollection.items,
    productFabrics: responses[5].data.productFabricCollection.items,
    productIcons: [...sortedProductIcons, ...productIcons],
    productSettings: responses[7].data.productSettings,
    saleTags: responses[8].data.saleTagCollection.items
  }
}

export default fetchGlobalSettings
