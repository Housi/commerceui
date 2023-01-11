import algoliasearch from 'algoliasearch/lite'

const client = algoliasearch('YB62UI0SGC', 'dbe2ec2a6264fe17cdfe4e53db83f398')

async function fetchSearchResults(queryValue) {
  if (!queryValue) {
    return null
  }

  let index
  let currencyCode

  index = client.initIndex('shopify_products')
  currencyCode = 'USD'

  let results = {
    products: []
  }

  const { hits } = await index.search(queryValue, { hitsPerPage: 96 })

  hits.forEach((el) => {
    console.log(el)
    let variants = []

    for (let step = 0; step < el.variants_count; step++) {
      variants.push({
        available: el.variants_inventory_count == 0 ? false : true,
        sku: el.sku
      })
    }
    let product = {
      id: el.id,
      title: el.title.split(' - ')[0],
      originalTitle: el.title,
      tags: el.tags,
      productType: el.product_type,
      primaryImage: el.product_image && {
        id: el.image,
        altText: el.title,
        originalSrc: el.product_image,
        from: 'shopify'
      },
      handle: el.handle,
      price: {
        currencyCode: currencyCode,
        amount: el.price.toString()
      },
      compareAtPrice:
        el.compare_at_price !== 0
          ? {
              amount: el.compare_at_price.toString(),
              currencyCode: currencyCode
            }
          : null,
      variants: variants
    }

    results.products.push(product)
  })

  return results
}

export default fetchSearchResults
