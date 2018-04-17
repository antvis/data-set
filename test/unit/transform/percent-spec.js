const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../src/index');

describe('View.transform(): percent', () => {
  const data = [
    { x: 1, y: 1, z: 1, extra: 'test' },
    { x: 2, y: 1, z: 2, extra: 'test' },
    { x: 3, y: 1, z: 3, extra: 'test' },
    { x: 4, y: 1, z: 4, extra: 'test' },
    { x: 1, y: 2, z: 5, extra: 'test' },
    { x: 2, y: 2, z: 6, extra: 'test' },
    { x: 3, y: 2, z: 7, extra: 'test' },
    { x: 4, y: 2, z: 8, extra: 'test' }
  ];
  const ds = new DataSet();
  let dv;

  beforeEach(() => {
    dv = ds.createView().source(data);
  });

  it('api', () => {
    expect(getTransform('percent')).to.be.a('function');
    expect(() => {
      dv.transform({
        type: 'percent'
      });
    }).to.throw();
  });

  it('default', () => {
    dv.transform({
      type: 'percent',
      field: 'z',
      dimension: 'y'
    });
    expect(dv.rows.length).to.equal(2);
    expect(dv.rows[0]).to.eql({
      x: 1,
      y: 1,
      z: 10,
      extra: 'test',
      _percent: 10 / 36
    });
  });

  it('as', () => {
    dv.transform({
      type: 'percent',
      field: 'z',
      dimension: 'y',
      as: '_z'
    });
    expect(dv.rows.length).to.equal(2);
    expect(dv.rows[0]).to.eql({
      x: 1,
      y: 1,
      z: 10,
      extra: 'test',
      _z: 10 / 36
    });
  });

  it('groupBy', () => {
    dv.transform({
      type: 'percent',
      field: 'z',
      dimension: 'y',
      groupBy: [ 'x' ],
      as: '_z'
    });
    expect(dv.rows.length).to.equal(8);
    expect(dv.rows[0]).to.eql({
      x: 1,
      y: 1,
      z: 1,
      extra: 'test',
      _z: 1 / 6
    });
  });

  it('when dimension and field is the same', () => {
    dv.transform({
      type: 'percent',
      field: 'y',
      dimension: 'y',
      as: '_y'
    });
    expect(dv.rows.length).to.equal(2);
    expect(dv.rows[0]).to.eql({
      x: 1,
      y: 1,
      z: 1,
      extra: 'test',
      _y: 4 / 12
    });
  });
});
