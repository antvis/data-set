// const regression = require('regression');
const {
  each
} = require('lodash');
const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../src/index');
const {
  REGRESSION_METHODS
} = require('../../../src/transform/regression');

describe('View.transform(): regression', () => {
  const data = [];
  for (let i = 1; i <= 10; i++) {
    // 1~10
    const b = i % 2;
    data.push({
      a: i,
      b
    });
  }
  const ds = new DataSet();
  let dv;
  beforeEach(() => {
    dv = ds.createView().source(data);
  });

  it('api', () => {
    expect(getTransform('regression')).to.be.a('function');
  });

  it('default: linear', () => {
    dv.transform({
      type: 'regression',
      fields: [ 'a', 'b' ]
    });
    expect(dv.rows.length).to.equal(6);
  });

  each(REGRESSION_METHODS, method => {
    it(`method: ${method}`, () => {
      dv.transform({
        type: 'regression',
        fields: [ 'a', 'b' ]
      });
      expect(dv.rows.length).to.equal(6);
    });
  });
});
