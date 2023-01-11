const getShopifyImageSrc = (params) => {

  const {width, height, src, crop} = params

  let _src = src.split('.jpg');
  let _options = "";

  if(width && height) {
    _options = _options +  `_${width}x${height}`
  } else {
    if(width) {
      _options = _options +  `_${width}x`
    }
    if(height) {
      _options = _options +  `_x${height}`
    }
  }

  if(crop) { // top, center, bottom, left, right
    _options = _options + `_crop_${crop}`
  }

  _src[0] = _src[0] + _options;

  return _src.join(".jpg");

};


export default getShopifyImageSrc