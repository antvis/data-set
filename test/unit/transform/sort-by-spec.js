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
  const ds = new DataSet();
  let dv;
  let populationChina;

  beforeEach(() => {
    populationChina = require('../../fixtures/population-china.json');
    populationChina.push({
      year: '2001',
      population: '1274530000'
    });
    dv = ds.createView().source(populationChina);
  });

  it('api', () => {
    expect(getTransform('sort-by')).to.be.a('function');
    expect(getTransform('sortBy')).to.be.a('function');
  });

  it('default', () => {
    dv.transform({
      type: 'sort-by'
    });
    expect(dv.rows).to.eql(populationChina.sort((a, b) => a.year - b.year));
  });

  it('specify columns', () => {
    dv.transform({
      type: 'sort-by',
      columns: [ 'year' ]
    });
    expect(dv.rows).to.eql(sortBy(populationChina, [ 'year' ]));
  });

  it('specify order', () => {
    dv.transform({
      type: 'sort-by',
      columns: [ 'year' ],
      order: 'DESC'
    });
    expect(dv.rows).to.eql(reverse(sortBy(populationChina, [ 'year' ])));
  });
});
