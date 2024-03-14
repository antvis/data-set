import DataSet from '../../../../src';
const { getTransform } = DataSet;
import flare from '../../../fixtures/flare.json';
import { View } from '../../../../src/view';

describe('View.transform(): hierarchy.treemap', () => {
  const ds = new DataSet();
  let dv: View;
  beforeEach(() => {
    dv = ds.createView();
  });

  it('api', () => {
    expect(typeof getTransform('hierarchy.treemap')).toBe('function');
    expect(typeof getTransform('treemap')).toBe('function');
  });

  it('default', () => {
    expect(() => {
      dv.transform({
        type: 'hierarchy.treemap',
        as: ['x', 'y'],
      });
    }).toThrow();
    expect(() => {
      dv.source(flare, {
        type: 'hierarchy',
      }).transform({
        type: 'hierarchy.treemap',
        as: ['x', 'y', 'extra'],
      });
    }).toThrow();
  });

  it('treemap', () => {
    dv.source(flare, {
      type: 'hierarchy',
    }).transform({
      type: 'hierarchy.treemap',
      as: ['x', 'y'],
    });
    const root = dv.root;
    expect(Array.isArray(root.x)).toBe(true);
    expect(Array.isArray(root.y)).toBe(true);
    expect(root.x.length).toEqual(4);
    expect(root.y.length).toEqual(4);
    // console.log(root)
  });
});
