const flattenDeep = require('lodash/flattenDeep');
const map = require('lodash/map');
const {
  max,
  mean,
  median,
  min,
  mode,
  quantile,
  standardDeviation,
  sum,
  variance
} = require('simple-statistics');
const {
  expect
} = require('chai');
const DataSet = require('../../../src/data-set');
const populationChina = require('../../fixtures/population-china.json');

describe('View API: statistics', () => {
  // statistics
  it('statistics methods', () => {
    const dv = new DataSet.View().source(populationChina);
    dv.transform({
      type: 'map',
      callback(row) {
        row.year = parseInt(row.year, 10);
        return row;
      }
    });
    const years = dv.getColumn('year');
    expect(dv.max('year')).to.equal(max(years));
    expect(dv.min('year')).to.equal(min(years));
    expect(dv.mean('year')).to.equal(mean(years));
    expect(dv.average('year')).to.equal(mean(years));
    expect(dv.median('year')).to.equal(median(years));
    expect(dv.mode('year')).to.equal(mode(years));
    expect(dv.quantile('year', 0.5)).to.equal(quantile(years, 0.5));
    expect(dv.quantiles('year', [ 0, 0.1, 0.5 ])).to.eql(map([ 0, 0.1, 0.5 ], p => quantile(years, p)));
    expect(dv.quantilesByFraction('year', 4)).to.eql(map([ 0, 0.25, 0.5, 0.75, 1 ], p => quantile(years, p)));
    expect(dv.standardDeviation('year')).to.equal(standardDeviation(years));
    expect(dv.sum('year')).to.equal(sum(years));
    expect(dv.variance('year')).to.equal(variance(years));
    expect(dv.range('year')).to.eql([ min(years), max(years) ]);
  });

  it('statistics methods on fields of array', () => {
    const data = [];
    for (let i = 1; i <= 10; i++) {
      // 1~10
      data.push({
        a: [ i, i + 10, [ -i, i * i, [ -i * i, 1 / i ]]]
      });
    }
    const dv = new DataSet.View().source(data);
    const values = flattenDeep(dv.getColumn('a'));
    expect(dv.max('a')).to.equal(max(values));
    expect(dv.min('a')).to.equal(min(values));
    expect(dv.mean('a')).to.equal(mean(values));
    expect(dv.average('a')).to.equal(mean(values));
    expect(dv.median('a')).to.equal(median(values));
    expect(dv.mode('a')).to.equal(mode(values));
    expect(dv.quantile('a', 0.5)).to.equal(quantile(values, 0.5));
    expect(dv.quantiles('a', [ 0, 0.1, 0.5 ])).to.eql(map([ 0, 0.1, 0.5 ], p => quantile(values, p)));
    expect(dv.quantilesByFraction('a', 4)).to.eql(map([ 0, 0.25, 0.5, 0.75, 1 ], p => quantile(values, p)));
    expect(dv.standardDeviation('a')).to.equal(standardDeviation(values));
    expect(dv.sum('a')).to.equal(sum(values));
    expect(dv.variance('a')).to.equal(variance(values));
    expect(dv.range('a')).to.eql([ min(values), max(values) ]);
  });
});
