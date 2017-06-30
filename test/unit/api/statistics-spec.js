const {
  max,
  mean,
  median,
  min,
  mode,
  standardDeviation,
  sum,
  variance
} = require('simple-statistics');
const {
  expect
} = require('chai');
const DataSet = require('../../../src/data-set');
const populationChina = require('../../fixtures/population-china.json');

describe('DataView API: statistics', () => {
  const dataSet = new DataSet();
  let dataView;

  beforeEach(() => {
    dataView = dataSet.createView('test').source(populationChina);
  });

  // statistics
  it('statistics methods', () => {
    dataView.transform({
      type: 'map',
      callback(row) {
        row.year = parseInt(row.year, 10);
        return row;
      }
    });
    const years = dataView.getColumn('year');
    expect(dataView.max('year')).to.equal(max(years));
    expect(dataView.min('year')).to.equal(min(years));
    expect(dataView.mean('year')).to.equal(mean(years));
    expect(dataView.average('year')).to.equal(mean(years));
    expect(dataView.median('year')).to.equal(median(years));
    expect(dataView.mode('year')).to.equal(mode(years));
    expect(dataView.standardDeviation('year')).to.equal(standardDeviation(years));
    expect(dataView.sum('year')).to.equal(sum(years));
    expect(dataView.variance('year')).to.equal(variance(years));
    expect(dataView.range('year')).to.eql([ min(years), max(years) ]);
  });
});
