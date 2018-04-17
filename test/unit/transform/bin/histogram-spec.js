const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../../src/index');

describe('View.transform(): bin.histogram', () => {
  const data = [];
  for (let i = 0; i <= 100; i++) {
    data.push({
      a: i
    });
  }
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
    const firstRow = dv.rows[0];
    expect(firstRow.x[1] - firstRow.x[0]).to.equal(100 / 30);
  });

  it('bins', () => {
    dv.transform({
      type: 'bin.histogram',
      field: 'a',
      bins: 10
    });
    expect(dv.rows[0]).to.eql({ x: [ 0, 10 ], count: 10 });
    expect(dv.rows[10]).to.eql({ x: [ 100, 110 ], count: 1 });
  });

  it('binWidth', () => {
    dv.transform({
      type: 'bin.histogram',
      field: 'a',
      binWidth: 10
    });
    expect(dv.rows[0]).to.eql({ x: [ 0, 10 ], count: 10 });
    expect(dv.rows[10]).to.eql({ x: [ 100, 110 ], count: 1 });
  });

  it('binWidth', () => {
    const emptyDv = ds.createView().source([]);
    expect(() => {
      emptyDv.transform({
        type: 'bin.histogram',
        field: 'a'
      });
    }).to.not.throw();
    emptyDv.transform({
      type: 'bin.histogram',
      field: 'a'
    });
    expect(emptyDv.rows.length).to.equal(0);
  });
});
