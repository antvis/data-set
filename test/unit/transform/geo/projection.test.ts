import DataSet from '../../../../src';
const { getTransform } = DataSet;
import geoWorld from '../../../fixtures/countries-geo.json';
import { View } from '../../../../src/view';

describe('View.transform(): geo.projection', () => {
  const ds = new DataSet();
  let dv: View;
  beforeEach(() => {
    dv = ds.createView();
  });

  it('api', () => {
    expect(typeof getTransform('geo.projection')).toBe('function');
  });

  it('default', () => {
    expect(() => {
      dv.transform({
        type: 'geo.projection',
        projection: 'geoAiry',
        as: ['x', 'y', 'centroidX', 'centroidY'],
      });
    }).toThrow();
    expect(() => {
      dv.source(geoWorld, {
        type: 'geo',
      }).transform({
        type: 'geo.projection',
        as: ['x', 'y', 'centroidX', 'centroidY'],
      });
    }).toThrow();
  });

  it('geo', () => {
    dv.source(geoWorld, {
      type: 'geo',
    }).transform({
      type: 'geo.projection',
      projection: 'geoAiry',
      as: ['x', 'y', 'centroidX', 'centroidY'],
    });
    const features = dv.rows;
    const feature = features[0];
    expect(feature).toHaveProperty('x');
    expect(feature).toHaveProperty('y');
    expect(feature).toHaveProperty('centroidX');
    expect(feature).toHaveProperty('centroidY');
  });
});
