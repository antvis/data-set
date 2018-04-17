const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../../src/index');

describe('View.transform(): bin.rectangle', () => {
  const data = [];
  for (let i = 0; i <= 100; i++) {
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
    expect(dv.rows.length).to.equal(31);
    expect(dv.rows[30].count).to.equal(1);
  });

  it('bins', () => {
    dv.transform({
      type: 'bin.rectangle',
      fields: [ 'a', 'b' ],
      bins: [ 20, 20 ]
    });
    expect(dv.rows.length).to.equal(21);
    expect(dv.rows[20].count).to.equal(1);
  });

  it('binWidth', () => {
    dv.transform({
      type: 'bin.rectangle',
      fields: [ 'a', 'b' ],
      binWidth: [ 20, 20 ]
    });
    expect(dv.rows.length).to.equal(6);
    expect(dv.rows[5].count).to.equal(1);
  });
});
