/*
 * kernel density estimation
 */
import { assign, each, forIn, isArray, isFunction, isNumber, isString, keys, pick } from '@antv/util';
import getSeriesValues from '../util/get-series-values';
import kernel from '../util/kernel';
import * as bandwidth from '../util/bandwidth';
import partition from '../util/partition';
import { getFields } from '../util/option-parser';
import { kernelDensityEstimation } from 'simple-statistics';
import { View } from '../view';
import { getColumn, range } from './default';

const DEFAULT_OPTIONS = {
  minSize: 0.01,
  as: ['key', 'y', 'size'],
  // fields: [ 'y1', 'y2' ], // required, one or more fields
  extent: [], // extent to execute regression function, default: [ [ min(x), max(x) ], [ min(y), max(y) ] ]
  method: 'gaussian', // kernel method: should be one of keys(kernel)
  bandwidth: 'nrd', // bandwidth method to execute kernel function // nrd, silverman or a fixed bandwidth value
  step: 0,
  groupBy: [],
};

const KERNEL_METHODS = keys(kernel);
const BANDWIDTH_METHODS = keys(bandwidth);

export interface Options {
  minSize?: number;
  as?: string[];
  fields: string[];
  /** extent to execute regression function, default: [ [ min(x), max(x) ], [ min(y), max(y) ] ] */
  extent?: [number, number];
  /**  kernel method: should be one of keys(kernel), like 'gaussian */
  method?: string;
  bandwidth?: number;
  step?: number;
  groupBy?: string[];
}

const kde = (items: View['rows'], options: Options): any[] => {
  const rows = [...(items || [])];
  // @ts-ignore
  options = assign({}, DEFAULT_OPTIONS, options);
  const fields = getFields(options);
  if (!isArray(fields) || fields.length < 1) {
    throw new TypeError('invalid fields: must be an array of at least 1 strings!');
  }
  const as = options.as;
  if (!isArray(as) || as.length !== 3) {
    throw new TypeError('invalid as: must be an array of 3 strings!');
  }
  let method = options.method;
  if (isString(method)) {
    if (KERNEL_METHODS.indexOf(method) === -1) {
      throw new TypeError(`invalid method: ${method}. Must be one of ${KERNEL_METHODS.join(', ')}`);
    }
    method = kernel[method];
  }
  if (!isFunction(method)) {
    throw new TypeError('invalid method: kernel method must be a function!');
  }

  let extent = options.extent;
  // @ts-ignore
  if (!isArray(extent) || extent.length === 0) {
    let rangeArr = [];
    each(fields, (field) => {
      const ranged = range(rows, field);
      rangeArr = rangeArr.concat(ranged);
    });
    extent = [Math.min(...rangeArr), Math.max(...rangeArr)];
  }
  let bw = options.bandwidth;
  if (isString(bw) && bandwidth[bw]) {
    bw = bandwidth[bw as string](getColumn(rows, fields[0]));
  } else if (isFunction(bw)) {
    bw = bw(getColumn(rows, fields[0]));
  } else if (!isNumber(bw) || bw <= 0) {
    bw = bandwidth.nrd(getColumn(rows, fields[0]));
  }
  const seriesValues = getSeriesValues(extent, options.step ? options.step : bw);
  const result: any = [];

  const groupBy = options.groupBy;
  const groups = partition(rows, groupBy);
  forIn(groups, (group) => {
    const probalityDensityFunctionByField = {};
    each(fields, (field) => {
      const row: any = pick(group[0], groupBy);
      probalityDensityFunctionByField[field] = kernelDensityEstimation(
        group.map((item) => item[field]),
        // @ts-ignore
        method,
        bw
      );
      const [key, y, size] = as;
      row[key] = field;
      row[y] = [];
      row[size] = [];
      each(seriesValues, (yValue) => {
        const sizeValue = probalityDensityFunctionByField[field](yValue);
        if (sizeValue >= options.minSize) {
          row[y].push(yValue);
          row[size].push(sizeValue);
        }
      });
      result.push(row);
    });
  });

  return result;
};

function kdeTransform(dataView: View, options: Options): void {
  dataView.rows = kde(dataView.rows, options);
}

export { KERNEL_METHODS, BANDWIDTH_METHODS, kdeTransform, kde };
