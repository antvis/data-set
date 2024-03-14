import DataSet from '../../../src';
const { getConnector } = DataSet;
import geoWorld from '../../fixtures/countries-geo.json';
import { View } from '../../../src/view';

describe('View.source(): geojson', () => {
  const ds = new DataSet();
  let dv: View;
  beforeEach(() => {
    dv = ds.createView();
  });

  it('api', () => {
    expect(typeof getConnector('geo')).toBe('function');
    expect(typeof getConnector('geojson')).toBe('function');
    expect(typeof getConnector('GeoJSON')).toBe('function');
  });

  it('default', () => {
    expect(() => {
      dv.source(geoWorld, {
        type: 'geo',
      });
    }).not.toThrow();
  });
});
