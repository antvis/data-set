import DataSet from '../../../src';
import { View } from '../../../src/view';
import { proportionTransform } from '../../../src/transform/proportion';
const { getTransform } = DataSet;

describe('View.transform(): proportion', () => {
  DataSet.registerTransform('proportion', proportionTransform);

  const ds = new DataSet();
  const data = [
    { x: 1, y: 1, z: 1 },
    { x: 2, y: 1, z: 2 },
    { x: 3, y: 1, z: 3 },
    { x: 4, y: 1, z: 4 },
    { x: 1, y: 2, z: 5 },
    { x: 2, y: 2, z: 6 },

    { x: 3, y: 2, z: 7 },
    { x: 4, y: 2, z: 8 },
  ];
  let dv: View;

  beforeEach(() => {
    dv = ds.createView().source(data);
  });

  it('api', () => {
    expect(typeof getTransform('proportion')).toBe('function');
    expect(() => {
      // @ts-ignore
      dv.transform({ type: 'proportion' });
    }).toThrow();
  });

  it('default', () => {
    dv.transform({
      type: 'proportion',
      field: 'z',
      dimension: 'y',
    });
    expect(dv.rows.length).toEqual(2);
    expect(dv.rows[0]).toEqual({
      x: 1,
      y: 1,
      z: 4,
      _proportion: 0.5,
    });
  });

  it('as', () => {
    dv.transform({
      type: 'proportion',
      field: 'z',
      dimension: 'y',
      as: '_z',
    });
    expect(dv.rows.length).toEqual(2);
    expect(dv.rows[0]).toEqual({
      x: 1,
      y: 1,
      z: 4,
      _z: 0.5,
    });
  });

  it('groupBy', () => {
    dv.transform({
      type: 'proportion',
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
      _z: 0.5,
    });
  });

  it('when dimension and field is the same', () => {
    dv.transform({
      type: 'proportion',
      field: 'y',
      dimension: 'y',
      as: '_y',
    });
    expect(dv.rows.length).toEqual(2);
    expect(dv.rows[0]).toEqual({
      x: 1,
      y: 1,
      z: 1,
      _y: 1 / 2,
    });
  });
});
