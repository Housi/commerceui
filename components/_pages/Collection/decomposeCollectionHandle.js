const decomposeCollectionHandle = fullHandle => {
  const things = fullHandle.split('__');

  let handle = things[0];

  const values = {};

  for(let i = 1; i < things.length; i++) {

    const parts = things[i].split('_');
    const key = parts[0];

    let val;

    if (key === 'page') {

      val = parseInt(parts[1]);

    } else {

      val = parts.slice(1);

    }
    if(key === "page") {
      values[key] = val;
    } else {
      if(!values.filters) {
        values.filters = [];
      }
      if(values.filters.find(f => f.id === key)) {
        values.filters.find(f => f.id === key).selectedOptions.push(val)
      } else {
        values.filters.push({id: key, selectedOptions: val})
      }
    }
  }

  if (!values.page) {
    values.page = 1;
  }

  return { handle, values }

}

export default decomposeCollectionHandle