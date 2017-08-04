const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../../index');

describe('DataView.transform(): bin.rectangle', () => {
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
    expect(getTransform('bin.rectangle')).to.be.a('function');
    expect(getTransform('bin.rect')).to.be.a('function');
  });

  it('default', () => {
    dv.transform({
      type: 'bin.rectangle',
      fields: [ 'a', 'b' ]
    });
    expect(dv.rows[0].x).to.eql([ 0, 2, 2, 0 ]);
    expect(dv.rows[0].y).to.eql([ 0, 0, 2, 2 ]);
    expect(dv.rows[10].x).to.eql([ 8, 10, 10, 8 ]);
    expect(dv.rows[10].y).to.eql([ 8, 8, 10, 10 ]);
  });

  it('thresholds', () => {
    dv.transform({
      type: 'bin.rectangle',
      fields: [ 'a', 'b' ],
      thresholdsX: [ 0, 5, 11 ],
      thresholdsY: [ 0, 5, 11 ]
    });
    expect(dv.rows[0].x).to.eql(dv.rows[1].x);
    expect(dv.rows[0].y).to.eql(dv.rows[1].y);
    expect(dv.rows[9].x).to.eql(dv.rows[10].x);
    expect(dv.rows[9].y).to.eql(dv.rows[10].y);
  });

});
