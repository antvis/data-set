import * as d3Geo from 'd3-geo';
import * as d3GeoProjection from 'd3-geo-projection';
import * as d3CompositeProjection from 'd3-composite-projections';
import getGeoProjection from '../../../src/util/get-geo-projection';

describe('util: getGeoProjection(rows, groupBy, orderBy)', () => {
  it('api', () => {
    expect(typeof getGeoProjection).toBe('function');
  });

  it('default', () => {
    expect(getGeoProjection()).toBe(null);
    expect(typeof getGeoProjection(() => 'test')).toBe('string');
    expect(typeof getGeoProjection('geoAzimuthalEqualArea')).toBe('function');
    expect(getGeoProjection('geoAzimuthalEqualArea')([0, 0])).toEqual(d3Geo.geoAzimuthalEqualArea()([0, 0]));
    expect(getGeoProjection('geoAiry')([0, 0])).toEqual(d3GeoProjection.geoAiry()([0, 0]));
    expect(typeof getGeoProjection('geoAlbersUsaTerritories')).toBe('function');
    expect(getGeoProjection('geoAlbersUsaTerritories')([0, 0])).toEqual(
      d3CompositeProjection.geoAlbersUsaTerritories()([0, 0])
    );
  });
});
