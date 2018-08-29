const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../src/index');
const iris = require('../../fixtures/iris-en.json');

describe('View.transform(): KDE', () => {
  const ds = new DataSet();
  let dv;
  const fields = [ 'petalWidth', 'petalLength', 'sepalWidth', 'sepalLength' ];

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
      fields
    });
    const rows = dv.rows;
    expect(rows.length).to.equal(4);
  });

  it('groupBy', () => {
    dv.transform({
      type: 'kde',
      fields,
      groupBy: [ 'species' ]
    });
    const rows = dv.rows;
    expect(rows.length).to.equal(12);
  });

  it('step', () => {
    dv.transform({
      type: 'kde',
      fields,
      extent: [ 0, 8 ],
      step: 1,
      as: [ 'x', 'y', 'size' ]
    });
    dv.rows.forEach(row => {
      expect(row.y.length <= ((8 - 0) / 1 + 1)).to.equal(true);
    });
  });

  it('extent', () => {
    dv.transform({
      type: 'kde',
      fields,
      extent: [ 2, 6 ],
      step: 1,
      as: [ 'x', 'y', 'size' ]
    });
    dv.rows.forEach(row => {
      expect(row.y.length <= ((6 - 2) / 1 + 1)).to.equal(true);
    });
  });

  it('minSize', () => {
    dv.transform({
      type: 'kde',
      fields,
      minSize: 0.1
    });
    dv.rows.forEach(row => {
      row.size.forEach(size => {
        expect(size >= 0.1).to.equal(true);
      });
    });
  });
});
