import { assign } from '@antv/util';
import { geoArea, geoCentroid, geoContains, geoDistance, geoLength, ExtendedFeature } from 'd3-geo';
import { geoProject } from 'd3-geo-projection';
import { View } from '../view';
import getGeoProjection from '../util/get-geo-projection';

const api = {
  // geo maintain
  geoArea(feature: ExtendedFeature) {
    return geoArea(feature);
  },
  geoAreaByName(this: View, name: string) {
    return geoArea(this.geoFeatureByName(name));
  },
  geoCentroid(feature: ExtendedFeature) {
    return geoCentroid(feature);
  },
  geoCentroidByName(this: View, name: string) {
    return geoCentroid(this.geoFeatureByName(name));
  },
  geoDistance(p1: any, p2: any) {
    return geoDistance(p1, p2);
  },
  geoLength(feature: ExtendedFeature) {
    return geoLength(feature);
  },
  geoLengthByName(this: View, name: string) {
    return geoLength(this.geoFeatureByName(name));
  },
  geoContains(feature: ExtendedFeature, position: [number, number] /* [longitude, latitude] */) {
    return geoContains(feature, position);
  },
  geoFeatureByName(this: View, name: string): any {
    const rows = this.rows;
    let result;
    rows.some((feature) => {
      if (feature.name === name) {
        result = feature;
        return true;
      }
      return false;
    });
    return result;
  },
  geoFeatureByPosition(this: View, position: [number, number]): any {
    const rows = this.rows;
    let result;
    rows.some((feature) => {
      if (geoContains(feature, position)) {
        result = feature;
        return true;
      }
      return false;
    });
    return result;
  },
  geoNameByPosition(this: View, position: [number, number]) {
    const feature = this.geoFeatureByPosition(position);
    if (feature) {
      return feature.name;
    }
  },
  // projection
  // export getGeoProjection for custom used.
  getGeoProjection,

  geoProject(feature: ExtendedFeature, projection: string, exportRaw?: boolean) {
    projection = getGeoProjection(projection, exportRaw);
    return geoProject(feature, projection);
  },
  geoProjectByName(this: View, name: string, projection: string, exportRaw?: boolean) {
    projection = getGeoProjection(projection, exportRaw);
    return geoProject(this.geoFeatureByName(name), projection);
  },
  geoProjectPosition(position: [number, number], projection: string, exportRaw?: boolean) {
    const func = getGeoProjection(projection, exportRaw);
    return func(position);
  },
  geoProjectInvert(position: [number, number] /* [x, y] */, projection: string, exportRaw?: boolean) {
    const func = getGeoProjection(projection, exportRaw);
    return func.invert(position);
  },
};
assign(View.prototype, api);

export type GeoApi = typeof api;
