import DataSet from '../../../../src';
import { View } from '../../../../src/view';
const { getTransform } = DataSet;

describe('View.transform(): bin.rectangle', () => {
  const data = [];
  for (let i = 0; i <= 100; i++) {
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
    expect(typeof getTransform('bin.rectangle')).toBe('function');
    expect(typeof getTransform('bin.rect')).toBe('function');
  });

  it('default', () => {
    dv.transform({
      type: 'bin.rectangle',
      fields: ['a', 'b'],
    });
    expect(dv.rows.length).toEqual(31);
    expect(dv.rows[30].count).toEqual(1);
  });

  it('bins', () => {
    dv.transform({
      type: 'bin.rectangle',
      fields: ['a', 'b'],
      bins: [20, 20],
    });
    expect(dv.rows.length).toEqual(21);
    expect(dv.rows[20].count).toEqual(1);
  });

  it('binWidth', () => {
    dv.transform({
      type: 'bin.rectangle',
      fields: ['a', 'b'],
      binWidth: [20, 20],
    });
    expect(dv.rows.length).toEqual(6);
    expect(dv.rows[5].count).toEqual(1);
  });
});
