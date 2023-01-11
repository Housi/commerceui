export const removeEdges = (data) => {
  return data.edges.map(edge => edge.node)
}

export const mapProduct = (product) => {
  if(!product) {
     return null
  }
  const mapMedia = media => {

    if(media.mediaContentType === "IMAGE") {
      return {
        type: "IMAGE",
        alt: media.alt,
        originalSrc: media.image.originalSrc,
        id: media.image.id,
        from: "shopify"
      }
    } else if(media.mediaContentType === "VIDEO") {
      return {
        type: "VIDEO",
        from: "shopify",
        alt: media.alt,
        sources: media.sources
      }
    } else {
      return null
    }
  }
  const _variants = removeEdges(product.variants);

  const _media = product.media ? removeEdges(product.media).map(item => mapMedia(item)) : null;
  const _images = removeEdges(product.images).map(item => ({...item, from: 'shopify', type: "IMAGE"}));
  const _primaryImage = _images[0] ?? null;
  const _secondaryImage = _images[1] ?? null;

  let _splittedTitle = product.title.split(" - ");

  const _color = _splittedTitle[1] ?? null;
  const _price = _variants.map(variant => variant.priceV2)[0];
  const _compareAtPrice = _variants.map(variant => variant.compareAtPriceV2)[0];

  const POSSIBLE_OPTION_NAMES = [ "LENGTH", "Size", "Title"];
  let _optionsToSelect = [];
  _variants.forEach(v => {
    POSSIBLE_OPTION_NAMES.forEach(OPTION_NAME => {
      const optionValue = v.selectedOptions.find(o => o.name === OPTION_NAME)?.value;
      if (!optionValue) {return}

      const currentOption = _optionsToSelect.find(o => o.name === OPTION_NAME)
      if(!currentOption) {
        _optionsToSelect.push({
          name: OPTION_NAME,
          values: [{
            title: optionValue,
            id: optionValue
          }]
        })
      } else {
        if(!currentOption.values.some(o => o.id === optionValue)) {
          _optionsToSelect.find(o => o.name === OPTION_NAME).values.push({
            title: optionValue,
            id: optionValue
          })
        }
      }
    })
  })

  const _productHasLengths = _variants.map(v => v.selectedOptions.some(o => o.name === "LENGTH")).length > 0

  const mapFilteringLengths = (variant) => {
    return variant.selectedOptions.find(o => o.name === "LENGTH")?.value ?? null;
  };

  const mapSize = (variant) => {
    let value = variant.selectedOptions.find(o => o.name === "Size")?.value ?? null;
    if(!value) {return null}
    if (value.includes('/')) {
      let values = value.split('/');
      return values.map(v => ({
        id: v.toLowerCase(),
        label: v,
        isAvailable: variant.quantityAvailable > 0
      }))
    }
    return ({
      id: value.toLowerCase().replace('/', '-'),
      label: value,
      isAvailable: variant.quantityAvailable > 0
    })
  };
  const _sizes = _variants.map(mapSize).flat()

  /// only for filtering purposes
  const filteringSizes = (_sizes.length > 0 && !(_sizes.every(s => s === null)) ) ? _sizes : null;
  const filteringLengths = _productHasLengths ? _variants.map(mapFilteringLengths) : null
  const filteringColor = product.tags.find(t => t.startsWith('color-'))?.split('-')[1] ?? null;

  const restProduct = {
    title: _splittedTitle[0],
    originalTitle: product.title,
    sizingHtml: product.sizingHtml?.value ?? null,
    detailsHtml: product.detailsHtml?.value ?? null,
    descriptionTag: product.descriptionTag?.value ?? null,
    preorderInfo: product.preorderInfo?.value ?? null,
    productType: product.productType ?? null,
    enableStylesWith: product.enableStylesWith?.value ?? false,
    stylesWith: product.stylesWith?.value.split("###") ?? null,
    bundlePieces: product.bundlePieces?.value.split("###") ?? null,
    bundleDiscount: product.bundleDiscount?.value ?? null,
    bundleMessage: product.bundleMessage?.value ?? null,
    tags: product.tags,
    media: product.media ? _media : _images,
    primaryImage: _primaryImage,
    secondaryImage: _secondaryImage,
    collections: product.collections ? removeEdges(product.collections) : null,
    featuredImage: product.featuredImage?.value? {originalSrc: product.featuredImage.value, from: "shopify"} : null,
    featuredImageCollections: [ product.featuredImageManualCollection?.value?? null, product.featuredImageAutomatedCollection?.value?? null]
      .filter(c => !!c),
    color: _color,
    price: _price,
    compareAtPrice: _compareAtPrice,
    relatedProducts: [],
    optionsToSelect: _optionsToSelect,
    filteringSizes: filteringSizes,
    filteringColor: filteringColor,
    filteringLengths: filteringLengths,
  };

  return ({
     ...product,
     ...restProduct,
     variants: _variants.map(variant => ({
        title: variant.title,
        id: variant.id,
        quantityAvailable: variant.quantityAvailable,
        sku: variant.sku,
        available: variant.availableForSale,
        productId: product.id,
        productHandle: product.handle,
        price: variant.priceV2,
        compareAtPrice: variant.compareAtPriceV2?? null,
        selectedOptions: variant.selectedOptions,
        currentlyNotInStock: variant.currentlyNotInStock
     })),
  })
}

export const mapHandleIfProductExists = (map, h) => {
  if(typeof map[h] === 'undefined') { return null }
  return map[h]
}

export const mapCheckoutProduct = (product) => {
   const newProduct = mapProduct(product);

   const generateVariant = (variant) => ({
      ...variant,
      size: { id: variant.title, label: variant.title },
      isLowStock: false,
      isFinalSale: false,
   })
   return {
      ...newProduct,
      variants: newProduct.variants.map(variant => ({
         ...generateVariant(variant),
         product: {
            ...newProduct,
            variants: newProduct.variants.map(v => ({
               ...generateVariant(v)
            }))
         }
      }))
   }
}

export const mapCollection = (collection) => {
  return {
      id: collection.id,
      handle: collection.handle,
      text: collection.description,
      image: collection.image ? {
         ...collection.image,
         alt: collection.image.altText,
          from: "shopify"
      } : null,
      title: collection.title,
      products: removeEdges(collection.products).map(mapProduct),
   }
}
