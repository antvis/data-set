const simpleStatistics = require('simple-statistics');
const {
  each,
  forIn,
  groupBy,
  map,
  uniq
} = require('lodash');
const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../index');
const {
  VALID_AGGREGATES
} = require('../../../src/transform/aggregate');

const data = [];
for (let i = 1; i <= 10; i++) {
  // 1~10
  const b = i % 2;
  data.push({
    a: i,
    b
  });
}

describe('DataView.transform(): aggregate', () => {
  const dataSet = new DataSet();
  let dataView;

  beforeEach(() => {
    dataView = dataSet.createView('test').source(data);
  });

  it('api', () => {
    expect(getTransform('aggregate')).to.be.a('function');
  });

  it('default: count', () => {
    dataView.transform({
      type: 'aggregate'
    });
    expect(dataView.rows.length).to.equal(1);
    expect(dataView.rows[0]).to.eql({
      count: 10
    });
  });

  it('all', () => {
    dataView.transform({
      type: 'aggregate',
      fields: map(VALID_AGGREGATES, () => 'a'),
      groupBy: [ 'b' ],
      operations: VALID_AGGREGATES,
      as: VALID_AGGREGATES
    });
    const groups = groupBy(data, row => row.b);
    const partitions = [[], []];
    forIn(groups, (group, i) => {
      partitions[i] = map(group, row => row.a);
    });
    const results = map(partitions, part => {
      const result = {};
      each(VALID_AGGREGATES, operation => {
        if (simpleStatistics[operation]) {
          result[operation] = simpleStatistics[operation](part);
        } else if (operation === 'count') {
          result.count = part.length;
        } else if (operation === 'distinct') {
          result.distinct = uniq(part).length;
        }
      });
      return result;
    });
    expect(dataView.rows).to.eql(results);
  });
});
