const getHexBrightness = (color) => {
  return ((parseInt(color.slice(1,3), 16) + parseInt(color.slice(3,5), 16) + parseInt(color.slice(5,7), 16)) / 3) / 2.55;
};

export default getHexBrightness