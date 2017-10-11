const assign = require('lodash/assign');
const forIn = require('lodash/forIn');
const {
  registerTransform
} = require('../data-set');
const partition = require('../util/partition');

const DEFAULT_OPTIONS = {
  // field: 'y', // required
  // dimension: 'x', // required
  groupBy: [], // optional
  as: '_proportion'
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
    const totalCount = group.length;
    const innerGroups = partition(group, [ dimension ]);
    forIn(innerGroups, innerGroup => {
      const innerCount = innerGroup.length;
      // const resultRow = pick(innerGroup[0], union(groupBy, [ dimension ]));
      const resultRow = innerGroup[0];
      // FIXME in case dimension and field is the same
      const dimensionValue = resultRow[dimension];
      resultRow[field] = innerCount;
      resultRow[dimension] = dimensionValue;
      resultRow[as] = innerCount / totalCount;
      result.push(resultRow);
    });
  });
  dataView.rows = result;
}

registerTransform('proportion', transform);
