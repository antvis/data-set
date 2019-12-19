import regression from 'regression';
import { assign, isArray, isNumber } from '@antv/util';
import getSeriesValues from '../util/get-series-values';
import { DataSet } from '../data-set';
import { getFields } from '../util/option-parser';
import { silverman } from '../util/bandwidth';
import { View } from '../view';

const DEFAULT_OPTIONS: Partial<Options> = {
  as: ['x', 'y'],
  // fields: [ 'x', 'y' ], // required two fields
  method: 'linear', // regression method: linear, exponential, logarithmic, power, polynomial
  // extent: [], // extent to execute regression function, default: [ min(x), max(x) ]
  // bandwidth: 1, // bandWidth to execute regression function
  order: 2, // order of the polynomial curve
  precision: 2, // the number of significant figures the output is rounded to
};

export interface Options {
  as?: string[];
  method?: 'linear' | 'exponential' | 'logarithmic' | 'power' | 'polynomial';
  fields: string[];
  bandwidth?: number;
  extent?: [number, number];
  order?: number;
  precision?: number;
}

const REGRESSION_METHODS = ['linear', 'exponential', 'logarithmic', 'power', 'polynomial'];

function transform(dataView: View, options: Options): void {
  options = assign({} as Options, DEFAULT_OPTIONS, options);
  const fields = getFields(options);
  if (!isArray(fields) || fields.length !== 2) {
    throw new TypeError('invalid fields: must be an array of 2 strings.');
  }
  const [xField, yField] = fields;
  const method = options.method;
  if (REGRESSION_METHODS.indexOf(method) === -1) {
    throw new TypeError(`invalid method: ${method}. Must be one of ${REGRESSION_METHODS.join(', ')}`);
  }
  const points: any[] = dataView.rows.map((row) => [row[xField], row[yField]]);
  const regressionResult = regression[method](points, options);
  let extent = options.extent;
  if (!isArray(extent) || extent.length !== 2) {
    extent = dataView.range(xField);
  }
  let bandwidth = options.bandwidth;
  if (!isNumber(bandwidth) || bandwidth <= 0) {
    bandwidth = silverman(dataView.getColumn(xField));
  }
  const valuesToPredict = getSeriesValues(extent, bandwidth);
  const result: any[] = [];
  const [asX, asY] = options.as;
  valuesToPredict.forEach((value) => {
    const row: any = {};
    const [x, y] = regressionResult.predict(value);
    row[asX] = x;
    row[asY] = y;
    if (isFinite(y)) {
      result.push(row);
    }
  });
  dataView.rows = result;
}

DataSet.registerTransform('regression', transform);

export default {
  REGRESSION_METHODS,
};
