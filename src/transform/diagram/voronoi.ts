import * as d3Voronoi from 'd3-voronoi';
import { assign, isArray } from '@antv/util';
import { DataSet } from '../../data-set';
const { registerTransform } = DataSet;
import { getFields } from '../../util/option-parser';
import { View } from '../../view';

const DEFAULT_OPTIONS: Partial<Options> = {
  // fields: [ 'x', 'y' ] // field x and field y, required
  // extend: [[x0, y0], [x1, y1]], // optional
  // size: [width, height], // optional
  as: ['_x', '_y'],
};

export interface Options {
  fields: [string, string];
  extend?: [[number, number], [number, number]];
  size?: [number, number];
  as?: [string, string];
}

function transform(dataView: View, options: Options): void {
  options = assign({} as Options, DEFAULT_OPTIONS, options);

  const as = options.as;
  if (!isArray(as) || as.length !== 2) {
    throw new TypeError('Invalid as: must be an array with two strings!');
  }
  const xField = as[0];
  const yField = as[1];

  const fields = getFields(options);
  if (!isArray(fields) || fields.length !== 2) {
    throw new TypeError('Invalid fields: must be an array with two strings!');
  }
  const x = fields[0];
  const y = fields[1];

  const rows = dataView.rows;
  const data: [number, number][] = rows.map((row) => [row[x], row[y]]);
  const voronoi = d3Voronoi.voronoi();
  if (options.extend) {
    voronoi.extent(options.extend);
  }
  if (options.size) {
    voronoi.size(options.size);
  }
  const polygons = voronoi(data).polygons();
  rows.forEach((row, i) => {
    const polygon = polygons[i].filter((point) => !!point); // some points are null
    row[xField] = polygon.map((point) => point[0]);
    row[yField] = polygon.map((point) => point[1]);
  });
}

registerTransform('diagram.voronoi', transform);
registerTransform('voronoi', transform);
