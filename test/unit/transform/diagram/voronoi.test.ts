import DataSet from '../../../../src';
import { View } from '../../../../src/view';
const { getTransform } = DataSet;

describe('View.transform(): diagram.voronoi', () => {
  const ds = new DataSet();
  let dv: View;
  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
    });
  }
  beforeEach(() => {
    dv = ds.createView().source(data);
  });

  it('api', () => {
    expect(typeof getTransform('diagram.voronoi')).toBe('function');
    expect(typeof getTransform('voronoi')).toBe('function');
  });

  it('default', () => {
    expect(() => {
      dv.transform({
        type: 'diagram.voronoi',
        as: ['_x', '_y'],
      });
    }).toThrow();
    expect(() => {
      dv.transform({
        type: 'diagram.voronoi',
        fields: ['x', 'y'],
        as: ['_x', '_y', 'extra'],
      });
    }).toThrow();
  });

  it('voronoi', () => {
    dv.transform({
      type: 'diagram.voronoi',
      fields: ['x', 'y'],
      as: ['_x', '_y'],
    });
    const rows = dv.rows;
    const firstRow = rows[0];
    expect(Array.isArray(firstRow._x)).toBe(true);
    expect(Array.isArray(firstRow._y)).toBe(true);
    expect(firstRow._x.length).toEqual(firstRow._y.length);
  });
});
