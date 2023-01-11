
const formatPrice = (price) => {

  let _amount = typeof price.amount === "number" ? price.amount : parseFloat(price.amount); // assume that _amount is a number

  _amount = (Math.floor(_amount *  100) / 100 )
    .toFixed(2)
    .toString()
    .replace('.00','');

  return `$${_amount}`

};

export default formatPrice;
