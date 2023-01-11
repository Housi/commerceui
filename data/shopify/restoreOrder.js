String.prototype.hashCode = function() {
  var hash = 0;
  if (this.length == 0) {
    return hash;
  }
  for (var i = 0; i < this.length; i++) {
    var char = this.charCodeAt(i);
    hash = ((hash<<5)-hash)+char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

export function getIdFromLineItem(lineItem) {
  let customAttributes = []
  if(lineItem.customAttributes) {
    customAttributes = [...lineItem.customAttributes].map(attr => {
      delete attr["__typename"]
      return {
        ...attr
      }
    })
    customAttributes.sort((x, y) => x.key.localeCompare(y.key));
  }

  let string = lineItem.variant.id +  lineItem.quantity + JSON.stringify(customAttributes);
  return string.hashCode();
}

export function restoreOrder(before, after) {
  console.assert(before.length === after.length, "Arrays in restore order must be of the same length");

  let hashesBefore = before.map(getIdFromLineItem);

  let result = [];

  after.forEach(lineItem => {
    let id = getIdFromLineItem(lineItem);

    let index = hashesBefore.indexOf(id);

    console.assert(index > -1, "Hash doesnt exist");

    result[index] = lineItem;
  });

  return result;

}
