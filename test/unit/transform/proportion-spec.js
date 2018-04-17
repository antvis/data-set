const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../src/index');

describe('View.transform(): proportion', () => {
  const ds = new DataSet();
  const data = [
    { x: 1, y: 1, z: 1 },
    { x: 2, y: 1, z: 2 },
    { x: 3, y: 1, z: 3 },
    { x: 4, y: 1, z: 4 },
    { x: 1, y: 2, z: 5 },
    { x: 2, y: 2, z: 6 },
    { x: 3, y: 2, z: 7 },
    { x: 4, y: 2, z: 8 }
  ];
  let dv;

  beforeEach(() => {
    dv = ds.createView().source(data);
  });

  it('api', () => {
    expect(getTransform('proportion')).to.be.a('function');
    expect(() => {
      dv.transform({
        type: 'proportion'
      });
    }).to.throw();
  });

  it('default', () => {
    dv.transform({
      type: 'proportion',
      field: 'z',
      dimension: 'y'
    });
    expect(dv.rows.length).to.equal(2);
    expect(dv.rows[0]).to.eql({
      x: 1,
      y: 1,
      z: 4,
      _proportion: 0.5
    });
  });

  it('as', () => {
    dv.transform({
      type: 'proportion',
      field: 'z',
      dimension: 'y',
      as: '_z'
    });
    expect(dv.rows.length).to.equal(2);
    expect(dv.rows[0]).to.eql({
      x: 1,
      y: 1,
      z: 4,
      _z: 0.5
    });
  });

  it('groupBy', () => {
    dv.transform({
      type: 'proportion',
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
      _z: 0.5
    });
  });

  it('when dimension and field is the same', () => {
    dv.transform({
      type: 'proportion',
      field: 'y',
      dimension: 'y',
      as: '_y'
    });
    expect(dv.rows.length).to.equal(2);
    expect(dv.rows[0]).to.eql({
      x: 1,
      y: 1,
      z: 1,
      _y: 1 / 2
    });
  });
});
