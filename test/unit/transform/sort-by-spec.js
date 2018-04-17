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
} = require('../../../src/index');
const populationChina = require('../../fixtures/population-china.json');
const data = populationChina.concat({
  year: '2001',
  population: '1274530000'
});

describe('View.transform(): sort-by', () => {
  const ds = new DataSet();
  let dv;

  beforeEach(() => {
    dv = ds.createView().source(data);
  });

  it('api', () => {
    expect(getTransform('sort-by')).to.be.a('function');
    expect(getTransform('sortBy')).to.be.a('function');
  });

  it('default', () => {
    dv.transform({
      type: 'sort-by'
    });
    expect(dv.rows).to.eql(data.sort((a, b) => a.year - b.year));
  });

  it('specify columns', () => {
    dv.transform({
      type: 'sort-by',
      columns: [ 'year' ]
    });
    expect(dv.rows).to.eql(sortBy(data, [ 'year' ]));
  });

  it('specify order', () => {
    dv.transform({
      type: 'sort-by',
      columns: [ 'year' ],
      order: 'DESC'
    });
    expect(dv.rows).to.eql(reverse(sortBy(data, [ 'year' ])));
  });
});
