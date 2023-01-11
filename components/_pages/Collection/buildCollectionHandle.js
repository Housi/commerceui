const buildCollectionHandle = (handle, values) => {
  let ret = handle;
  if(values.filters && values.filters.length > 0) {

    values.filters.forEach(f => {
      ret += '__' + f.id;
      f.selectedOptions.forEach( v => {
        ret += `_${v}`
      })
    })

  }

  if (values.page && values.page > 1) {
    ret += `__page_${values.page}`;
  }

  return ret;
}

export default buildCollectionHandle