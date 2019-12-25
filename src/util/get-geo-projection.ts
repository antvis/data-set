import { isString, isFunction } from '@antv/util';
import * as d3Geo from 'd3-geo';
import * as d3GeoProjection from 'd3-geo-projection';
import * as d3CompositeProjection from 'd3-composite-projections';
/*
 * getGeoProjection
 *
 * @param {string|function} projection  projection name or projection function
 * @param {boolean} [exportRaw = false] - whether return the raw projection or not
 * */
export default (projection: string, exportRaw = false) => {
  if (isFunction(projection)) {
    return exportRaw ? projection : projection();
  }
  if (isString(projection)) {
    // @ts-ignore
    if (d3Geo[projection]) {
      // @ts-ignore
      return exportRaw ? d3Geo[projection] : d3Geo[projection]();
    }
    if (d3GeoProjection[projection]) {
      return exportRaw ? d3GeoProjection[projection] : d3GeoProjection[projection]();
    }
    if (d3CompositeProjection[projection]) {
      return exportRaw ? d3CompositeProjection[projection] : d3CompositeProjection[projection]();
    }
  }
  return null;
};
