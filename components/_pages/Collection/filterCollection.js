function getColorValues(products) {
    const arr = [];
    const colors = {};

    products.forEach(product => {
        if (product.filteringColor && !colors[product.filteringColor]) {
            colors[product.filteringColor] = true;
            arr.push({
              id: product.filteringColor, label: product.filteringColor
            });
        }
    });

    return arr;
}
function getSizeValues(products) {
  const arr = [];
  const sizes = {};

  products.forEach(product => {
    if (product.filteringSizes) {
      product.filteringSizes.forEach(size => {
          if (size && !sizes[size.id]) {
            sizes[size.id] = true;
            arr.push(size)
          }
      })
    }
  });

  return arr;
}


function getTypeValues(products) {
  const arr = [];
  const types = {};

  products.forEach(product => {
    if (product.productType && !types[product.productType]) {
      types[product.productType] = true;
      arr.push({
        id: product.productType.toLowerCase(),
        label: product.productType
      });
    }
  });

  return arr;
}


const filterCollection = (collection, options) => {
  let collectionNoFilter = collection;

  if(options.filters) {
    let colorFilter = options.filters.find(f => f.id === "color");
    let sizeFilter = options.filters.find(f => f.id === "size");
    let typeFilter = options.filters.find(f => f.id === "type");
    let selectedSortOption = options.filters.find(f => f.id === "sort")?.selectedOptions[0];

    if (colorFilter) {
      const products = collection.products.filter(p => colorFilter.selectedOptions.includes(p.filteringColor));
      collection = {
        ...collection,
        products
      }
    }

    if (sizeFilter) {
      const isAnyOfSelectedSizeAvailable = (productSizes, selectedOptions) => {
        if(!productSizes) {return false} // dont show product with no size
        return productSizes
          .filter(size => selectedOptions.some(o => size.id === o))
          .filter(size => size.isAvailable).length > 0
      };

      const products = collection.products.filter(
        p => isAnyOfSelectedSizeAvailable(p.filteringSizes, sizeFilter.selectedOptions)
      );
      collection = {
        ...collection,
        products
      }
    }

    if(typeFilter) {
      const products = collection.products.filter(p => typeFilter.selectedOptions.includes(p.productType.toLowerCase()));
      collection = {
        ...collection,
        products
      }
    }

    if (selectedSortOption) {
      if (selectedSortOption === "newest") {

        const products = [...collection.products];

        products.sort((a, b) => {
          return (a.publishedAt < b.publishedAt) ? 1 : ((a.publishedAt > b.publishedAt) ? -1 : 0);
        });

        collection = {
          ...collection,
          products
        }
      }
      else if (selectedSortOption === "price-asc" || selectedSortOption === "price-desc") {

        const products = [...collection.products];

        products.sort((x, y) => {

          let priceX = parseFloat(x.price.amount);
          let priceY = parseFloat(y.price.amount);

          if (selectedSortOption === "price-asc") {
            let tmp = priceX;
            priceX = priceY;
            priceY = tmp;
          }

          if (priceX < priceY) {
            return 1
          }
          else if (priceX === priceY) {
            return 0;
          }
          else {
            return -1;
          }
        });

        collection = {
          ...collection,
          products
        }
      }
    }

  }

  const colors = getColorValues(collectionNoFilter.products);
  const sizes = getSizeValues(collectionNoFilter.products);
  const types = getTypeValues(collectionNoFilter.products);

  let filters = [];

  if (types.length > 0) {
    filters.push({
      id: "type",
      label: "Type",
      type: "multiselect",
      options: types
    })
  }

  if (sizes.length > 0) {
    filters.push({
      id: "size",
      label: "Size",
      type: "multiselect",
      options: sizes
    })
  }

  if (colors.length > 0) {
    filters.push({
      id: "color",
      label: "Color",
      type: "multiselect",
      options: colors
    })
  }

  filters.push({
    id: "sort",
    label: "Sort by",
    type: "select",
    options: [
      {
        id: 'relevance',
        label: 'Relevance'
      },
      {
        id: 'price-asc',
        label: 'Price low to high'
      },
      {
        id: 'price-desc',
        label: 'Price high to low'
      },
      {
        id: 'newest',
        label: 'Newest'
      }
    ]
  });

  return { collection, filters }
}

export default filterCollection
