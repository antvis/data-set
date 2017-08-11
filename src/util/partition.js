const map = require('lodash/map');
const groupBy = require('lodash/groupBy');
const simpleSortBy = require('./simple-sort-by');

module.exports = (rows, group_by, order_by = []) => {
  let newRows = rows;
  if (order_by && order_by.length) {
    newRows = simpleSortBy(rows, order_by);
  }
  const groups = groupBy(newRows, row => {
    return map(group_by, col => row[col]).join('-');
  });
  return groups;
};
