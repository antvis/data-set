const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../src/index');

describe('View.transform(): impute', () => {
  const data = [
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 3 },
    { x: 0 },
    { x: 1, y: 5 },
    { x: 1, y: 6 },
    { x: 1, y: 7 },
    { x: 1 },
    { x: 1, y: 9 },
    { x: 2, y: null },
    { x: 2 }
  ];
  // const length = data.length;
  const ds = new DataSet();
  let dv;

  beforeEach(() => {
    dv = ds.createView().source(data);
  });

  it('api', () => {
    expect(getTransform('impute')).to.be.a('function');
  });

  it('default', () => {
    expect(() => {
      dv.transform({
        type: 'impute'
      });
    }).to.throw();
  });

  it('value', () => {
    dv.transform({
      field: 'y',
      groupBy: [ 'x' ],
      method: 'value',
      type: 'impute',
      value: 10
    });
    const rows = dv.rows;
    expect(rows[3].y).to.equal(10);
    expect(rows[7].y).to.equal(10);
    expect(rows[9].y).to.equal(null);
  });

  it('max', () => {
    dv.transform({
      field: 'y',
      groupBy: [ 'x' ],
      method: 'max',
      type: 'impute'
    });
    const rows = dv.rows;
    expect(rows[3].y).to.equal(3);
    expect(rows[7].y).to.equal(9);
    expect(rows[9].y).to.equal(null);
  });

  it('not grouping', () => {
    dv.transform({
      field: 'y',
      method: 'max',
      type: 'impute'
    });
    const rows = dv.rows;
    expect(rows[3].y).to.equal(9);
    expect(rows[7].y).to.equal(9);
    expect(rows[9].y).to.equal(null);
  });

  it('groupBy & orderBy', () => {
    dv.transform({
      field: 'y',
      groupBy: 'x',
      orderBy: 'x',
      method: 'max',
      type: 'impute'
    });
    const rows = dv.rows;
    expect(rows[3].y).to.equal(3);
    expect(rows[7].y).to.equal(9);
    expect(rows[9].y).to.equal(null);
  });
});
