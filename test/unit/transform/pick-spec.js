const {
  map,
  pick
} = require('lodash');
const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../src/index');
const populationChina = require('../../fixtures/population-china.json');

describe('View.transform(): pick', () => {
  const ds = new DataSet();
  let dv;
  beforeEach(() => {
    dv = ds.createView().source(populationChina);
  });

  it('api', () => {
    expect(getTransform('pick')).to.be.a('function');
  });

  it('default', () => {
    dv.transform({
      type: 'pick'
    });
    expect(dv.rows).to.eql(populationChina);
  });

  it('fields', () => {
    dv.transform({
      type: 'pick',
      fields: [ 'year' ]
    });
    expect(dv.rows).to.eql(map(populationChina, row => pick(row, [ 'year' ])));
  });
});
