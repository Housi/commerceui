const putLineItemsQuantity = (lineItems) => {
  let quantity = 0;
  lineItems.forEach( i => quantity = quantity + i.quantity);
  return quantity
}

export default putLineItemsQuantity