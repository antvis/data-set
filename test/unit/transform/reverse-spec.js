const {
  reverse
} = require('lodash');
const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../src/index');
const populationChina = require('../../fixtures/population-china.json');

describe('View.transform(): reverse', () => {
  const ds = new DataSet();
  let dv;

  beforeEach(() => {
    dv = ds.createView().source(populationChina);
  });

  it('api', () => {
    expect(getTransform('reverse')).to.be.a('function');
  });

  it('default', () => {
    dv.transform({
      type: 'reverse'
    });
    expect(dv.rows).to.eql(reverse(populationChina));
  });
});
