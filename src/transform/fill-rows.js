const assign = require('lodash/assign');
const each = require('lodash/each');
const indexOf = require('lodash/indexOf');
const map = require('lodash/map');
const some = require('lodash/some');
const partition = require('../util/partition');
const {
  registerTransform
} = require('../data-set');

const DEFAULT_OPTIONS = {
  groupBy: [],
  orderBy: []
};

function arrayDifference(arr1, arr2) {
  // arrayDifference([1, 1, 1, 2], [1, 2]) => [1, 1]
  const shadow = map(arr1, item => item); // shadow copy
  each(arr2, item => {
    const index = indexOf(shadow, item);
    if (index > -1) {
      shadow.splice(index, 1);
    }
  });
  return shadow;
}

function transform(dataView, options = {}) {
  options = assign({}, DEFAULT_OPTIONS, options);
  const rows = dataView.rows;
  const groupBy = options.groupBy;
  const orderBy = options.orderBy;
  const groups = partition(rows, groupBy, orderBy);
  let maxLength = 0;
  let referenceGroup = [];
  each(groups, group => {
    if (group.length > maxLength) {
      maxLength = group.length;
      referenceGroup = group;
    }
  });
  const referenceOrderByKeys = [];
  const referenceRowByOrderByKey = {};
  each(referenceGroup, row => {
    const key = map(orderBy, col => row[col]).join('-');
    referenceOrderByKeys.push(key);
    referenceRowByOrderByKey[key] = row;
  });
  each(groups, group => {
    if (group !== referenceGroup && group.length < maxLength) {
      const first = group[0];
      // missing orderBy keys
      const orderByKeys = [];
      each(group, row => {
        orderByKeys.push(map(orderBy, col => row[col]).join('-'));
      });
      const missingOrderByKeys = arrayDifference(referenceOrderByKeys, orderByKeys);

      some(missingOrderByKeys, (key, i) => {
        if (i >= (maxLength - group.length)) { // group length overflow
          return true;
        }
        const referenceRow = referenceRowByOrderByKey[key];
        // create one row
        const row = {};
        each(groupBy, col => {
          row[col] = first[col];
        });
        each(orderBy, col => {
          row[col] = referenceRow[col];
        });
        rows.push(row);
        return false;
      });
    }
  });
}

registerTransform('fill-rows', transform);
registerTransform('fillRows', transform);
