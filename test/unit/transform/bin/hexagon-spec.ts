import { expect } from 'chai';
import DataSet from '../../../../src';
import { View } from '../../../../src/view';
const { getTransform } = DataSet;

describe('View.transform(): bin.hexagon', () => {
  const data = [];
  for (let i = 0; i <= 10; i++) {
    data.push({
      a: i,
      b: i,
    });
  }
  const ds = new DataSet();
  let dv: View;
  beforeEach(() => {
    dv = ds.createView().source(data);
  });

  it('api', () => {
    expect(getTransform('bin.hexagon')).to.be.a('function');
    expect(getTransform('bin.hex')).to.be.a('function');
    expect(getTransform('hexbin')).to.be.a('function');
    expect(
      getTransform('bin.hexagon') === getTransform('bin.hex') && getTransform('bin.hexagon') === getTransform('hexbin')
    ).to.equal(true);
  });

  it('default', () => {
    dv.transform({
      type: 'bin.hexagon',
      fields: ['a', 'b'],
    });
    expect(dv.rows[0].x.length).to.equal(6);
    expect(dv.rows[0].y.length).to.equal(6);
  });

  it('bins', () => {
    dv.transform({
      type: 'bin.hexagon',
      fields: ['a', 'b'],
      bins: [2, 2],
    });
    expect(dv.rows.length).to.equal(5);
  });
});
