const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../index');

describe('DataView.transform(): percent', () => {
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
      y: 1,
      z: 10,
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
      y: 1,
      z: 10,
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
      _z: 1 / 6
    });
  });
});
