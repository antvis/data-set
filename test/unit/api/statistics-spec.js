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
  const ds = new DataSet();
  let dv;
  beforeEach(() => {
    dv = ds.createView().source(populationChina);
  });

  // statistics
  it('statistics methods', () => {
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
});
