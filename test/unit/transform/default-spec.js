const {
  expect
} = require('chai');
const {
  DataSet,
  DataView,
  getTransform
} = require('../../../index');
const populationChina = require('../../fixtures/population-china.json');

describe('DataView.transform(): default', () => {
  const dataSet = new DataSet();
  let dataView;

  beforeEach(() => {
    dataView = new DataView(dataSet);
    dataView.source(populationChina);
  });

  it('api', () => {
    expect(getTransform()).to.be.a('function');
    expect(getTransform('default')).to.be.a('function');
    expect(getTransform('this-transform-is-not-exists-xxx')).to.be.a('function');
  });

  it('default', () => {
    dataView.transform();
    expect(dataView.rows).to.eql(populationChina);
  });
});

