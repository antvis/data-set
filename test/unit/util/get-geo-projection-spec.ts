import { expect } from 'chai';
import * as d3Geo from 'd3-geo';
import * as d3GeoProjection from 'd3-geo-projection';
import * as d3CompositeProjection from 'd3-composite-projections';
import getGeoProjection from '../../../src/util/get-geo-projection';

describe('util: getGeoProjection(rows, groupBy, orderBy)', () => {
  it('api', () => {
    expect(getGeoProjection).to.be.a('function');
  });

  it('default', () => {
    expect(getGeoProjection()).to.be.a('null');
    expect(getGeoProjection(() => 'test')).to.be.a('string');
    expect(getGeoProjection('geoAzimuthalEqualArea')).to.be.a('function');
    expect(getGeoProjection('geoAzimuthalEqualArea')([0, 0])).to.eql(d3Geo.geoAzimuthalEqualArea()([0, 0]));
    expect(getGeoProjection('geoAiry')([0, 0])).to.eql(d3GeoProjection.geoAiry()([0, 0]));
    expect(getGeoProjection('geoAlbersUsaTerritories')).to.be.a('function');
    expect(getGeoProjection('geoAlbersUsaTerritories')([0, 0])).to.eql(
      d3CompositeProjection.geoAlbersUsaTerritories()([0, 0])
    );
  });
});
