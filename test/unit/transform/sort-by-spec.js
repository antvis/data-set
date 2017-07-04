const {
  reverse,
  sortBy
} = require('lodash');
const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../index');

describe('DataView.transform(): sort-by', () => {
  const dataSet = new DataSet();
  let dataView;
  let populationChina;

  beforeEach(() => {
    populationChina = require('../../fixtures/population-china.json');
    populationChina.push({
      year: '2001',
      population: '1274530000'
    });
    dataView = dataSet.createView('test').source(populationChina);
  });

  it('api', () => {
    expect(getTransform('sort-by')).to.be.a('function');
    expect(getTransform('sortBy')).to.be.a('function');
  });

  it('default', () => {
    dataView.transform({
      type: 'sort-by'
    });
    expect(dataView.rows).to.eql(populationChina.sort((a, b) => a.year - b.year));
  });

  it('specify columns', () => {
    dataView.transform({
      type: 'sort-by',
      columns: [ 'year' ]
    });
    expect(dataView.rows).to.eql(sortBy(populationChina, [ 'year' ]));
  });

  it('specify order', () => {
    dataView.transform({
      type: 'sort-by',
      columns: [ 'year' ],
      order: 'DESC'
    });
    expect(dataView.rows).to.eql(reverse(sortBy(populationChina, [ 'year' ])));
  });
});
