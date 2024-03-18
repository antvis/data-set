/*
 * @reference: https://github.com/Planeshifter/kernel-smooth/blob/master/lib/index.js
 */
import { assign, isArray, isNumber, isString, keys, isNil } from '@antv/util';
import getSeriesValues from '../../util/get-series-values';
import kernel from '../../util/kernel';
import { sum } from 'simple-statistics';
import { getFields } from '../../util/option-parser';
import { silverman } from '../../util/bandwidth';
import { View } from '../../view';
import { getColumn, range } from '../default';

const DEFAULT_OPTIONS: Partial<Options> = {
  as: ['x', 'y'],
  // fields: [ 'x', 'y' ], // required, one or two fields
  method: 'gaussian', // kernel method: should be one of keys(kernel)
  // extent: [], // extent to execute regression function, default: [ min(x), max(x) ]
  // bandwidth: 0.5 // bandWidth to execute kernel function
};

export interface Options {
  as?: [string, string?];
  fields?: [string, string?];
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
  extent?: [number, number];
  bandwidth?: number;
}

const KERNEL_METHODS = keys(kernel);

// calculates weight for i-th obs
function weight(kernel, bandwidth: number, x_0: number, x_i: number): any {
  const arg = (x_i - x_0) / bandwidth;
  return kernel(arg);
}
// calculates weight for i-th obs when p > 1
// function weight_vectors(kernel, bandwidth, x_0, x_i) {
//   const arg = enclideanDistance(x_i, x_0) / bandwidth;
//   return kernel(arg);
// }
function vectorize(fun) {
  return function (x) {
    if (!isArray(x)) {
      return fun(x);
    }
    return x.map(function (x) {
      return fun(x);
    });
  };
}

const kernelRegression = (dvRows: View['rows'], options: Options): any[] => {
  const rows = [...(dvRows || [])];
  options = assign({} as Options, DEFAULT_OPTIONS, options);
  const fields = getFields(options);
  if (!isArray(fields) || !(fields.length === 1 || fields.length === 2)) {
    throw new TypeError('invalid fields: must be an array of 1 or 2 strings!');
  }
  const [asX, asY] = options.as;
  if (!isString(asX) || !isString(asY)) {
    throw new TypeError('invalid as: must be an array of 2 strings!');
  }
  let func: Function;
  const { method } = options;
  if (isString(method)) {
    if (KERNEL_METHODS.indexOf(method) === -1) {
      throw new TypeError(`invalid method: ${method}. Must be one of ${KERNEL_METHODS.join(', ')}`);
    }
    func = kernel[method];
  }

  const [xField, yField] = fields;
  const xs = getColumn(rows, xField);

  let extent = options.extent;
  if (extent || !isArray(extent)) {
    extent = range(rows, xField);
  }
  let bandwidth = options.bandwidth;
  if (!bandwidth || !isNumber(bandwidth) || bandwidth <= 0) {
    bandwidth = silverman(xs);
  }
  const seriesValues = getSeriesValues(extent, bandwidth);
  const xCount = xs.length;
  const weightFunc = weight.bind(null, func, bandwidth);
  let kernelSmoother;

  if (isNil(yField)) {
    // KDE
    kernelSmoother = vectorize((x) => {
      const weights = xs.map((x_i) => weightFunc(x, x_i));
      const num = sum(weights);
      const denom = xCount * bandwidth;
      if (!num || !denom) return 0;
      return num / denom;
    });
  } else {
    // kernel regression smoothing
    const ys = getColumn(rows, yField);
    kernelSmoother = vectorize((x: number[]) => {
      const weights = xs.map((x_i) => weightFunc(x, x_i));
      const num = sum(weights.map((w, i) => w * ys[i]));
      const denom = sum(weights);
      if (!num || !denom) return 0;
      return num / denom;
    });
  }

  const result = seriesValues.map((x) => {
    const row: any = {};
    row[asX] = x;
    row[asY] = kernelSmoother(x);
    return row;
  });

  return result;
};

function kernelRegressionTransform(dv: View, options: Options): void {
  dv.rows = kernelRegression(dv.rows, options);
}

export { kernelRegression, KERNEL_METHODS, kernelRegressionTransform };
