import { assign, isArray } from '@antv/util';
import { geoPath } from 'd3-geo';
import getPointAtLength from 'point-at-length';
import { DataSet } from '../../data-set';
const { registerTransform } = DataSet;
import getGeoProjection from '../../util/get-geo-projection';
import { View } from '../../view';

const DEFAULT_OPTIONS: Partial<Options> = {
  // projection: '', // default to null
  as: ['_x', '_y', '_centroid_x', '_centroid_y'],
};

export interface Options {
  projection: string;
  as?: string[];
}

function transform(dataView: View, options: Options): void {
  if (dataView.dataType !== 'geo' && dataView.dataType !== 'geo-graticule') {
    throw new TypeError('Invalid dataView: this transform is for Geo data only!');
  }
  options = assign({} as Options, DEFAULT_OPTIONS, options);
  let projection = options.projection;
  if (!projection) {
    throw new TypeError('Invalid projection!');
  }
  projection = getGeoProjection(projection);
  // @ts-ignore;
  const geoPathGenerator = geoPath(projection);
  const as = options.as;
  if (!isArray(as) || as.length !== 4) {
    throw new TypeError('Invalid as: it must be an array with 4 strings (e.g. [ "x", "y", "cX", "cY" ])!');
  }
  dataView._projectedAs = as;
  const [lonField, latField, centroidX, centroidY] = as;
  dataView.rows.forEach((row) => {
    row[lonField] = [];
    row[latField] = [];
    const pathData = geoPathGenerator(row);
    if (pathData) {
      // TODO projection returns null
      const points = getPointAtLength(pathData);
      points._path.forEach((point) => {
        row[lonField].push(point[1]);
        row[latField].push(point[2]);
      });
      const centroid = geoPathGenerator.centroid(row);
      row[centroidX] = centroid[0];
      row[centroidY] = centroid[1];
    }
  });
  dataView.rows = dataView.rows.filter((row) => row[lonField].length !== 0);
}

registerTransform('geo.projection', transform);
