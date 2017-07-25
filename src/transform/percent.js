const assign = require('lodash/assign');
const forIn = require('lodash/forIn');
const map = require('lodash/map');
const pick = require('lodash/pick');
const union = require('lodash/union');
const {
  sum
} = require('simple-statistics');
const {
  registerTransform
} = require('../data-set');
const partition = require('../util/partition');

const DEFAULT_OPTIONS = {
  // field: 'y', // required
  // dimension: 'x', // required
  groupBy: [], // optional
  as: '_percent'
};

function transform(dataView, options = {}) {
  options = assign({}, DEFAULT_OPTIONS, options);
  const field = options.field;
  const dimension = options.dimension;
  const groupBy = options.groupBy;
  const as = options.as;
  if (!field || !dimension) {
    throw new TypeError('Invalid options');
  }
  const rows = dataView.rows;
  const result = [];
  const groups = partition(rows, groupBy);
  forIn(groups, group => {
    const totalSum = sum(map(group, row => row[field]));
    const innerGroups = partition(group, [ dimension ]);
    forIn(innerGroups, innerGroup => {
      const innerSum = sum(map(innerGroup, row => row[field]));
      const resultRow = pick(innerGroup[0], union(groupBy, [ dimension ]));
      resultRow[as] = innerSum / totalSum;
      resultRow[field] = innerSum;
      result.push(resultRow);
    });
  });
  dataView.rows = result;
}

registerTransform('percent', transform);
