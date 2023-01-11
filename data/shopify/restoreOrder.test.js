import {restoreOrder} from "./restoreOrder";

test('empty', () => {
  let result = restoreOrder([], []);
  expect(result).toMatchObject([]);
});

const lineItem1 = {
  id: "141233",
  quantity: 1,
  customAttributes: [],
  variant: {
    id: "123456"
  }
};

const lineItem2 = {
  id: "2123",
  quantity: 2,
  customAttributes: [],
  variant: {
    id: "2"
  }
};

const lineItem3 = {
  id: "3123",
  quantity: 1,
  customAttributes: [],
  variant: {
    id: "3"
  }
};

const attributes1 = [
  {
    "key": "_set_handle",
    "value": "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC83MjE3MzgyMDk2OTQx,Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMjgwOTAyNDE5MjU1Nw==",
  },
  {
    "key": "_set_title",
    "value": "TONI TANK AND AIR WEIGHT HIGH RISE SHORT",
  },
  {
    "key": "_set_discount",
    "value": "SET15",
  }
];

const lineItem1WithAttrs = {
  ...lineItem1,
  customAttributes: attributes1,
};

const lineItem2WithAttrs = {
  ...lineItem2,
  customAttributes: attributes1,
};

const lineItem3WithAttrs = {
  ...lineItem3,
  customAttributes: attributes1,
};

test('corrects order without attributes', () => {
  let result = restoreOrder([lineItem1, lineItem2, lineItem3], [lineItem3, lineItem2, lineItem1]);
  expect(result).toMatchObject([lineItem1, lineItem2, lineItem3]);

  let result2 = restoreOrder([lineItem1, lineItem2, lineItem3], [lineItem1, lineItem3, lineItem2]);
  expect(result2).toMatchObject([lineItem1, lineItem2, lineItem3]);
});

test('corrects order with attributes', () => {
  let result = restoreOrder(
    [lineItem1, lineItem2, lineItem3, lineItem1WithAttrs, lineItem2WithAttrs],
    [lineItem1WithAttrs, lineItem3, lineItem2, lineItem2WithAttrs, lineItem1]
  );

  expect(result).toMatchObject([lineItem1, lineItem2, lineItem3, lineItem1WithAttrs, lineItem2WithAttrs]);
});

test('corrects order with attributes, ignores __typename', () => {
  let result = restoreOrder(
    [lineItem1, lineItem2, lineItem3, lineItem1WithAttrs, lineItem2WithAttrs],
    [lineItem1WithAttrs, lineItem3, lineItem2, lineItem2WithAttrs, lineItem1].map(
      lineItem => ({...lineItem, customAttributes: lineItem.customAttributes.map(attr => ({ ...attr, __typename: "Attribute"}))})
    )
  );

  expect(result).toMatchObject([lineItem1, lineItem2, lineItem3, lineItem1WithAttrs, lineItem2WithAttrs]);
});
