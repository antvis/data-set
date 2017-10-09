const isArray = require('lodash/isArray');
const isFunction = require('lodash/isFunction');
const map = require('lodash/map');
const groupBy = require('lodash/groupBy');
const simpleSortBy = require('./simple-sort-by');

module.exports = (rows, group_by, order_by = []) => {
  let newRows = rows;
  if (order_by && order_by.length) {
    newRows = simpleSortBy(rows, order_by);
  }

  let groupingFn;
  if (isFunction(group_by)) {
    groupingFn = group_by;
  } else if (isArray(group_by)) {
    groupingFn = row => `_${map(group_by, col => row[col]).join('-')}`;
    // NOTE: Object.keys({'b': 'b', '2': '2', '1': '1', 'a': 'a'}) => [ '1', '2', 'b', 'a' ]
    // that is why we have to add a prefix
  }
  const groups = groupBy(newRows, groupingFn);
  return groups;
};
