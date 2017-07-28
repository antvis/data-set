const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../../index');

const data = [];
for (let i = 0; i <= 100; i++) {
  data.push({
    a: i
  });
}

describe('DataView.transform(): bin.histogram', () => {
  const ds = new DataSet();
  let dv;
  beforeEach(() => {
    dv = ds.createView().source(data);
  });

  it('api', () => {
    expect(getTransform('bin.histogram')).to.be.a('function');
    expect(getTransform('bin.dot')).to.be.a('function');
  });

  it('default', () => {
    dv.transform({
      type: 'bin.histogram',
      field: 'a'
    });
    expect(dv.rows[0]).to.eql({ a: 0, x: [ 0, 10 ] });
    expect(dv.rows[99]).to.eql({ a: 99, x: [ 90, 100 ] });
  });

  it('domain', () => {
    dv.transform({
      type: 'bin.histogram',
      field: 'a',
      domain: [ 10, 100 ]
    });
    expect(dv.rows[0]).to.eql({ a: 0 });
    expect(dv.rows[99]).to.eql({ a: 99, x: [ 90, 100 ] });
  });

  it('thresholds', () => {
    dv.transform({
      type: 'bin.histogram',
      field: 'a',
      thresholds: [ 0, 10, 100 ]
    });
    expect(dv.rows[0]).to.eql({ a: 0, x: [ 0, 10 ] });
    expect(dv.rows[99]).to.eql({ a: 99, x: [ 10, 100 ] });
  });
});
