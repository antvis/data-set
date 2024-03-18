import DataSet from '../../../../src';
import { hexagonTransform } from '../../../../src/transform/bin/hexagon';
import { View } from '../../../../src/view';
const { getTransform } = DataSet;

describe('View.transform(): bin.hexagon', () => {
  DataSet.registerTransform('bin.hexagon', hexagonTransform);
  DataSet.registerTransform('bin.hex', hexagonTransform);
  DataSet.registerTransform('hexbin', hexagonTransform);
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
    expect(typeof getTransform('bin.hexagon')).toBe('function');
    expect(typeof getTransform('bin.hex')).toBe('function');
    expect(typeof getTransform('hexbin')).toBe('function');
    expect(
      getTransform('bin.hexagon') === getTransform('bin.hex') && getTransform('bin.hexagon') === getTransform('hexbin')
    ).toEqual(true);
  });

  it('default', () => {
    dv.transform({
      type: 'bin.hexagon',
      fields: ['a', 'b'],
    });
    expect(dv.rows[0].x.length).toEqual(6);
    expect(dv.rows[0].y.length).toEqual(6);
  });

  it('bins', () => {
    dv.transform({
      type: 'bin.hexagon',
      fields: ['a', 'b'],
      bins: [2, 2],
    });
    expect(dv.rows.length).toEqual(5);
  });
});
