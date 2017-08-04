const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../../index');

describe('DataView.transform(): bin.hexagon', () => {
  const data = [];
  for (let i = 0; i <= 10; i++) {
    data.push({
      a: i,
      b: i
    });
  }
  const ds = new DataSet();
  let dv;
  beforeEach(() => {
    dv = ds.createView().source(data);
  });

  it('api', () => {
    expect(getTransform('bin.hexagon')).to.be.a('function');
    expect(getTransform('bin.hex')).to.be.a('function');
  });

  it('default', () => {
    dv.transform({
      type: 'bin.hexagon',
      fields: [ 'a', 'b' ]
    });
    expect(dv.rows[0].x.length).to.equal(6);
    expect(dv.rows[0].y.length).to.equal(6);
  });

  it('radius', () => {
    dv.transform({
      type: 'bin.hexagon',
      fields: [ 'a', 'b' ],
      radius: 10
    });
    expect(dv.rows[0].x).to.eql(dv.rows[1].x);
    expect(dv.rows[9].x).to.eql(dv.rows[10].x);
  });

  // it('extent', () => {
  //   dv.transform({
  //     type: 'bin.hexagon',
  //     fields: [ 'a', 'b' ],
  //     extent: [[-10, -10], [10, 10]]
  //   });
  // });
});

describe('DataView.transform: bin.hexagon: the real world use case', () => {
});
