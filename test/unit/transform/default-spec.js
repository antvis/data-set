const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../index');
const populationChina = require('../../fixtures/population-china.json');

describe('DataView.transform(): default', () => {
  const ds = new DataSet();
  let dv;
  beforeEach(() => {
    dv = ds.createView().source(populationChina);
  });

  it('api', () => {
    expect(getTransform()).to.be.a('function');
    expect(getTransform('default')).to.be.a('function');
    expect(getTransform('this-transform-is-not-exists-xxx')).to.be.a('function');
  });

  it('default', () => {
    dv.transform();
    expect(dv.rows).to.eql(populationChina);
  });
});

