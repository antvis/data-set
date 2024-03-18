import { clone } from 'lodash';
import DataSet from '../../../../src';
import { View } from '../../../../src/view';
const { getTransform } = DataSet;

describe('View.transform(): bin.quantile', () => {
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
  const ds = new DataSet();
  let dv: View;
  beforeEach(() => {
    dv = ds.createView().source(clone(data));
  });

  it('api', () => {
    expect(typeof getTransform('bin.quantile')).toBe('function');
    expect(() => {
      dv.transform({
        type: 'bin.quantile',
      });
    }).toThrow();
  });

  it('fields', () => {
    dv.transform({
      type: 'bin.quantile',
      field: 'z',
    });
    const rows = dv.rows;
    expect(rows[0]._bin.length).toEqual(5);
  });

  it('as', () => {
    dv.transform({
      type: 'bin.quantile',
      field: 'z',
      as: '_z',
    });
    const rows = dv.rows;
    expect(rows[0]._z.length).toEqual(5);
  });

  it('grouBy', () => {
    dv.transform({
      type: 'bin.quantile',
      field: 'z',
      groupBy: ['x'],
      as: '_z',
    });
    const rows = dv.rows;
    expect(rows.length).toEqual(4);
    expect(rows[0]._z.length).toEqual(5);
  });
});
