import * as d3GeoProjection from 'd3-geo-projection';
import DataSet from '../../../src';
import geoWorld from '../../fixtures/countries-geo.json';

describe('View API: geo', () => {
  const dv = new DataSet().createView('test').source(geoWorld, {
    type: 'geojson',
  });
  const features = dv.rows;
  const feature0 = features[0];
  const name0 = feature0.name;
  const feature1 = features[1];
  const name1 = feature1.name;

  it('geoArea(feature)', () => {
    expect(dv.geoArea(feature0)).toEqual(0.016075045020474882);
    expect(dv.geoArea(geoWorld)).toEqual(16.19442017652553);
  });
  it('geoAreaByName(name)', () => {
    expect(dv.geoAreaByName(name0)).toEqual(0.016075045020474882);
  });

  it('geoCentroid(feature)', () => {
    expect(dv.geoCentroid(feature0)).toEqual([66.00365046020929, 33.840347839442174]);
    expect(dv.geoCentroid(geoWorld)).toEqual([28.413918613244718, 44.84875775550983]);
  });
  it('geoCentroidByName(name)', () => {
    expect(dv.geoCentroidByName(name0)).toEqual([66.00365046020929, 33.840347839442174]);
  });

  it('geoDistance(p1, p2)', () => {
    expect(dv.geoDistance([118 + 24 / 60, 33 + 57 / 60], [73 + 47 / 60, 40 + 38 / 60])).toEqual(0.6235846454638789);
  });

  it('geoLength(feature)', () => {
    expect(dv.geoLength(feature0)).toEqual(0.6920658293451696);
  });
  it('geoLengthByName(name)', () => {
    expect(dv.geoLengthByName(name0)).toEqual(0.6920658293451696);
  });

  it('geoContains(feature, position)', () => {
    expect(dv.geoContains(feature0, dv.geoCentroid(feature0))).toBe(true);
    expect(dv.geoContains(feature0, dv.geoCentroid(feature1))).toBe(false);
  });

  it('geoFeatureByName(name)', () => {
    expect(dv.geoFeatureByName(name0)).toEqual(feature0);
    expect(dv.geoFeatureByName(name1)).toEqual(feature1);
  });

  it('geoFeatureByPosition(position)', () => {
    expect(dv.geoFeatureByPosition(dv.geoCentroid(feature0))).toEqual(feature0);
    expect(dv.geoFeatureByPosition(dv.geoCentroid(feature1))).toEqual(feature1);
  });

  it('geoNameByPosition(position)', () => {
    expect(dv.geoNameByPosition(dv.geoCentroid(feature0))).toEqual(name0);
    expect(dv.geoNameByPosition(dv.geoCentroid(feature1))).toEqual(name1);
  });

  // projection
  it('geoProject(feature, projection)', () => {
    expect(dv.geoProject(feature0, 'geoAiry')).toEqual(d3GeoProjection.geoProject(feature0, d3GeoProjection.geoAiry()));
  });
  it('geoProjectByName(name, projection)', () => {
    expect(dv.geoProjectByName(name0, 'geoAiry')).toEqual(
      d3GeoProjection.geoProject(feature0, d3GeoProjection.geoAiry())
    );
  });
  it('geoProjectPosition(position, projection)', () => {
    expect(dv.geoProjectPosition([0, 0], 'geoAiry')).toEqual(d3GeoProjection.geoAiry()([0, 0]));
  });
  it('geoProjectInvert(point, projection)', () => {
    expect(dv.geoProjectInvert([300, 300], 'geoAiry')).toEqual(d3GeoProjection.geoAiry().invert([300, 300]));
  });
});
