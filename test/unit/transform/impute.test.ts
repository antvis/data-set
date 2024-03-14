import DataSet from '../../../src';
import { View } from '../../../src/view';
import { imputeTransform } from '../../../src/transform/impute';
const { getTransform } = DataSet;

describe('View.transform(): impute', () => {
  const data = [
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 3 },
    { x: 0 },
    { x: 1, y: 5 },
    { x: 1, y: 6 },
    { x: 1, y: 7 },
    { x: 1 },
    { x: 1, y: 9 },
    { x: 2, y: null },
    { x: 2 },
  ];
  DataSet.registerTransform('impute', imputeTransform);
  // const length = data.length;
  const ds = new DataSet();
  let dv: View;

  beforeEach(() => {
    dv = ds.createView().source(data);
  });

  it('api', () => {
    expect(typeof getTransform('impute')).toBe('function');
  });

  it('default', () => {
    expect(() => {
      // @ts-ignore
      dv.transform({ type: 'impute' });
    }).toThrow();
  });

  it('value', () => {
    dv.transform({
      field: 'y',
      groupBy: ['x'],
      method: 'value',
      type: 'impute',
      value: 10,
    });
    const rows = dv.rows;
    expect(rows[3].y).toEqual(10);
    expect(rows[7].y).toEqual(10);
    expect(rows[9].y).toEqual(null);
  });

  it('max', () => {
    dv.transform({
      field: 'y',
      groupBy: ['x'],
      method: 'max',
      type: 'impute',
    });
    const rows = dv.rows;
    expect(rows[3].y).toEqual(3);
    expect(rows[7].y).toEqual(9);
    expect(rows[9].y).toEqual(null);
  });

  it('not grouping', () => {
    dv.transform({
      field: 'y',
      method: 'max',
      type: 'impute',
    });
    const rows = dv.rows;
    expect(rows[3].y).toEqual(9);
    expect(rows[7].y).toEqual(9);
    expect(rows[9].y).toEqual(null);
  });

  it('groupBy & orderBy', () => {
    dv.transform({
      field: 'y',
      groupBy: 'x',
      // TODO: 这里应该无效
      // @ts-ignore
      orderBy: 'x',
      method: 'max',
      type: 'impute',
    });
    const rows = dv.rows;
    expect(rows[3].y).toEqual(3);
    expect(rows[7].y).toEqual(9);
    expect(rows[9].y).toEqual(null);
  });
});
