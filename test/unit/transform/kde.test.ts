import DataSet from '../../../src';
const { getTransform } = DataSet;
import iris from '../../fixtures/iris-en.json';
import { View } from '../../../src/view';
import { kdeTransform } from '../../../src/transform/kde';

describe('View.transform(): KDE', () => {
  DataSet.registerTransform('kernel-density-estimation', kdeTransform);
  DataSet.registerTransform('kde', kdeTransform);
  DataSet.registerTransform('KDE', kdeTransform);
  const ds = new DataSet();
  let dv: View;
  const fields = ['petalWidth', 'petalLength', 'sepalWidth', 'sepalLength'];

  beforeEach(() => {
    dv = ds.createView().source(iris);
  });

  it('api', () => {
    expect(typeof getTransform('KDE')).toBe('function');
    expect(typeof getTransform('kde')).toBe('function');
    expect(typeof getTransform('kernel-density-estimation')).toBe('function');
  });

  it('default', () => {
    expect(() => {
      dv.transform({
        type: 'KDE',
      });
    }).toThrow();
  });

  it('value', () => {
    dv.transform({
      type: 'kde',
      fields,
    });
    const rows = dv.rows;
    expect(rows.length).toEqual(4);
  });

  it('groupBy', () => {
    dv.transform({
      type: 'kde',
      fields,
      groupBy: ['species'],
    });
    const rows = dv.rows;
    expect(rows.length).toEqual(12);
  });

  it('step', () => {
    dv.transform({
      type: 'kde',
      fields,
      extent: [0, 8],
      step: 1,
      as: ['x', 'y', 'size'],
    });
    dv.rows.forEach((row) => {
      expect(row.y.length <= (8 - 0) / 1 + 1).toEqual(true);
    });
  });

  it('extent', () => {
    dv.transform({
      type: 'kde',
      fields,
      extent: [2, 6],
      step: 1,
      as: ['x', 'y', 'size'],
    });
    dv.rows.forEach((row) => {
      expect(row.y.length <= (6 - 2) / 1 + 1).toEqual(true);
    });
  });

  it('minSize', () => {
    dv.transform({
      type: 'kde',
      fields,
      minSize: 0.1,
    });
    dv.rows.forEach((row) => {
      row.size.forEach((size) => {
        expect(size >= 0.1).toEqual(true);
      });
    });
  });
});
