/*
 * @reference: https://github.com/Planeshifter/kernel-smooth/blob/master/lib/index.js
 */
import { assign, isArray, isNumber, isString, keys } from '@antv/util';
import getSeriesValues from '../../util/get-series-values';
import kernel from '../../util/kernel';
import { DataSet } from '../../data-set';
import { getFields } from '../../util/option-parser';
import { silverman } from '../../util/bandwidth';
import { View } from '../../view';

const DEFAULT_OPTIONS: Partial<Options> = {
  as: ['x', 'y', 'z'],
  // fields: [ 'x', 'y' ], // required, one or two fields
  method: 'gaussian', // kernel method: should be one of keys(kernel)
  // extent: [], // extent to execute regression function, default: [ [ min(x), max(x) ], [ min(y), max(y) ] ]
  // bandwidth: [], // bandWidth to execute kernel function
};

export interface Options {
  as?: [string, string, string];
  fields: [string, string];
  method:
    | 'cosine'
    | 'epanechnikov'
    | 'gaussian'
    | 'quartic'
    | 'triangular'
    | 'tricube'
    | 'triweight'
    | 'uniform'
    | 'boxcar';
  extent?: [[number, number], [number, number]];
  bandwidth?: [number, number];
}

const KERNEL_METHODS = keys(kernel);

function transform(dv: View, options: Options): void {
  options = assign({} as Options, DEFAULT_OPTIONS, options);
  const fields = getFields(options);
  if (!isArray(fields) || fields.length !== 2) {
    throw new TypeError('invalid fields: must be an array of 2 strings!');
  }
  const [asX, asY, asZ] = options.as;
  if (!isString(asX) || !isString(asY) || !isString(asZ)) {
    throw new TypeError('invalid as: must be an array of 3 strings!');
  }
  let method: Function;
  if (isString(options.method)) {
    if (KERNEL_METHODS.indexOf(options.method) === -1) {
      throw new TypeError(`invalid method: ${options.method}. Must be one of ${KERNEL_METHODS.join(', ')}`);
    }
    method = kernel[options.method];
  }

  const [xField, yField] = fields;
  const { extent, bandwidth } = options;
  let extentX: [number, number];
  let extentY: [number, number];
  if (extent && Array.isArray(extent) && Array.isArray(extent[0]) && Array.isArray(extent[1])) {
    [extentX, extentY] = extent;
  } else {
    extentX = dv.range(xField);
    extentY = dv.range(yField);
  }

  let bwX: number, bwY: number;

  if (
    bandwidth &&
    Array.isArray(bandwidth) &&
    bandwidth.slice(0, 2).every(isNumber) &&
    bandwidth.slice(0, 2).every((item) => item > 0)
  ) {
    [bwX, bwY] = bandwidth;
  } else {
    bwX = silverman(dv.getColumn(xField));
    bwY = silverman(dv.getColumn(yField));
  }
  const seriesValuesX = getSeriesValues(extentX, bwX);
  const seriesValuesY = getSeriesValues(extentY, bwY);
  const count = dv.rows.length;
  const result: any[] = [];

  for (let i = 0; i < seriesValuesX.length; i++) {
    for (let j = 0; j < seriesValuesY.length; j++) {
      let sum = 0;
      const x = seriesValuesX[i];
      const y = seriesValuesY[j];
      for (let k = 0; k < count; k++) {
        sum += method!((x - dv.rows[k][xField]) / bwX) * method!((y - dv.rows[k][yField]) / bwY);
      }
      const z = (1 / (count * bwX * bwY)) * sum;
      const row: any = {};
      row[asX] = x;
      row[asY] = y;
      row[asZ] = z;
      result.push(row);
    }
  }

  dv.rows = result;
}

DataSet.registerTransform('kernel-smooth.density', transform);
DataSet.registerTransform('kernel.density', transform);

export default {
  KERNEL_METHODS,
};
