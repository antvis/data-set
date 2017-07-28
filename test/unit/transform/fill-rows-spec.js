const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../index');

describe('DataView.transform(): fill-rows', () => {
  const data = [
    { x: 0, y: 28, c: 0 },
    { x: 0, y: 55, c: 1 },
    { x: 1, y: 43, c: 0 },
    { x: 1, y: 91, c: 1 },
    { x: 2, y: 81, c: 0 },
    { x: 2, y: 53, c: 1 },
    { x: 3, y: 19, c: 0 }
  ];
  const originLength = data.length;
  const ds = new DataSet();
  let dv;

  beforeEach(() => {
    dv = ds.createView().source(data);
  });

  it('api', () => {
    expect(getTransform('fill-rows')).to.be.a('function');
    expect(getTransform('fillRows')).to.be.a('function');
  });

  it('default', () => {
    dv.transform({
      type: 'fill-rows'
    });
    expect(dv.rows.length).to.equal(originLength);
  });

  it('groupBy', () => {
    dv.transform({
      type: 'fill-rows',
      groupBy: [ 'x' ]
    });
    const rows = dv.rows;
    expect(rows.length).to.equal(originLength + 1);
    expect(rows[originLength]).to.eql({
      x: 3
    });
  });

  it('orderBy', () => {
    dv.transform({
      type: 'fill-rows',
      orderBy: [ 'c' ]
    });
    expect(dv.rows.length).to.equal(originLength);
  });

  it('groupBy and orderBy', () => {
    dv.transform({
      type: 'fill-rows',
      groupBy: [ 'x' ],
      orderBy: [ 'c' ]
    });
    const rows = dv.rows;
    expect(rows.length).to.equal(originLength + 1);
    expect(rows[originLength]).to.eql({
      x: 3,
      c: 1
    });
  });
});
