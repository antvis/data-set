const map = require('lodash/map');
const groupBy = require('lodash/groupBy');
const orderBy = require('lodash/orderBy');

module.exports = (rows, group_by, order_by = []) => {
  const newRows = orderBy(rows, order_by);
  const groups = groupBy(newRows, row => {
    return map(group_by, col => row[col]).join('-');
  });
  return groups;
};
