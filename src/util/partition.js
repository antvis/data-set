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
    groupingFn = row => map(group_by, col => row[col]).join('-');
  }
  const groups = groupBy(newRows, groupingFn);
  return groups;
};
