import DataSet from '../../../src';
import { percentTransform } from '../../../src/transform/percent';
import { View } from '../../../src/view';
const { getTransform } = DataSet;

describe('View.transform(): percent', () => {
  DataSet.registerTransform('percent', percentTransform);
  const data = [
    { x: 1, y: 1, z: 1, extra: 'test' },
    { x: 2, y: 1, z: 2, extra: 'test' },
    { x: 3, y: 1, z: 3, extra: 'test' },
    { x: 4, y: 1, z: 4, extra: 'test' },
    { x: 1, y: 2, z: 5, extra: 'test' },
    { x: 2, y: 2, z: 6, extra: 'test' },
    { x: 3, y: 2, z: 7, extra: 'test' },
    { x: 4, y: 2, z: 8, extra: 'test' },
  ];
  const ds = new DataSet();
  let dv: View;

  beforeEach(() => {
    dv = ds.createView().source(data);
  });

  it('api', () => {
    expect(typeof getTransform('percent')).toBe('function');
    expect(() => {
      // @ts-ignore
      dv.transform({ type: 'percent' });
    }).toThrow();
  });

  it('default', () => {
    dv.transform({
      type: 'percent',
      field: 'z',
      dimension: 'y',
    });
    expect(dv.rows.length).toEqual(2);
    expect(dv.rows[0]).toEqual({
      x: 1,
      y: 1,
      z: 10,
      extra: 'test',
      _percent: 10 / 36,
    });
  });

  it('as', () => {
    dv.transform({
      type: 'percent',
      field: 'z',
      dimension: 'y',
      as: '_z',
    });
    expect(dv.rows.length).toEqual(2);
    expect(dv.rows[0]).toEqual({
      x: 1,
      y: 1,
      z: 10,
      extra: 'test',
      _z: 10 / 36,
    });
  });

  it('groupBy', () => {
    dv.transform({
      type: 'percent',
      field: 'z',
      dimension: 'y',
      groupBy: ['x'],
      as: '_z',
    });
    expect(dv.rows.length).toEqual(8);
    expect(dv.rows[0]).toEqual({
      x: 1,
      y: 1,
      z: 1,
      extra: 'test',
      _z: 1 / 6,
    });
  });

  it('when dimension and field is the same', () => {
    dv.transform({
      type: 'percent',
      field: 'y',
      dimension: 'y',
      as: '_y',
    });
    expect(dv.rows.length).toEqual(2);
    expect(dv.rows[0]).toEqual({
      x: 1,
      y: 1,
      z: 1,
      extra: 'test',
      _y: 4 / 12,
    });
  });
});
