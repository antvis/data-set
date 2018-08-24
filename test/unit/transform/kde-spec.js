const {
  expect
} = require('chai');
const keys = require('@antv/util/lib/object/keys.js');
const {
  DataSet,
  getTransform
} = require('../../../src/index');
const iris = require('../../fixtures/iris-en.json');

describe('View.transform(): KDE', () => {
  // const length = data.length;
  const ds = new DataSet();
  let dv;

  beforeEach(() => {
    dv = ds.createView().source(iris);
  });

  it('api', () => {
    expect(getTransform('KDE')).to.be.a('function');
    expect(getTransform('kde')).to.be.a('function');
    expect(getTransform('kernel-density-estimation')).to.be.a('function');
  });

  it('default', () => {
    expect(() => {
      dv.transform({
        type: 'KDE'
      });
    }).to.throw();
  });

  it('value', () => {
    dv.transform({
      type: 'kde',
      fields: [ 'petalWidth', 'petalLength', 'sepalWidth', 'sepalLength' ],
      as: [ 'x' /* , 'petalWidth', 'petalLength', 'sepalWidth', 'sepalLength'*/ ]
    });
    const rows = dv.rows;
    expect(rows.length > 0).to.equal(true);
    expect(keys(rows[0])).to.eql([ 'x', 'petalWidth', 'petalLength', 'sepalWidth', 'sepalLength' ]);
  });
});
