import { assign, flattenDeep, forIn, isArray, isString, keys, uniq } from '@antv/util';
import * as simpleStatistics from 'simple-statistics';
import partition from '../util/partition';
import { DataSet } from '../data-set';
const { registerTransform } = DataSet;
import { getFields } from '../util/option-parser';
import { View } from '../view';

const DEFAULT_OPTIONS: Options = {
  as: [],
  fields: [],
  groupBy: [],
  operations: [],
};

export interface Options {
  as?: string[];
  fields?: string[];
  groupBy?: string | string[] | ((item: any) => string);
  operations?: Array<
    | 'count'
    | 'max'
    | 'min'
    | 'mean'
    | 'average'
    | 'median'
    | 'mode'
    | 'product'
    | 'standardDeviation'
    | 'sum'
    | 'sumSimple'
    | 'variance'
  >;
}
const DEFAULT_OPERATION = 'count';

const aggregates: any = {
  count(data: any[]) {
    return data.length;
  },
  distinct(data: any[], field: string) {
    const values = uniq(data.map((row) => row[field]));
    return values.length;
  },
};

DataSet.CONSTANTS.STATISTICS_METHODS.forEach((method) => {
  aggregates[method] = (data: any[], field: string) => {
    let values = data.map((row) => row[field]);
    if (isArray(values) && isArray(values[0])) {
      values = flattenDeep(values);
    }
    // @ts-ignore
    return simpleStatistics[method](values);
  };
});
aggregates.average = aggregates.mean;

function transform(dataView: View, options: Options): void {
  options = assign({} as Options, DEFAULT_OPTIONS, options);
  const fields = getFields(options);
  if (!isArray(fields)) {
    throw new TypeError('Invalid fields: it must be an array with one or more strings!');
  }
  let outputNames = options.as || [];
  if (isString(outputNames)) {
    outputNames = [outputNames];
  }
  let operations: any[] = options.operations;
  if (isString(operations)) {
    operations = [operations];
  }
  const DEFAULT_OPERATIONS = [DEFAULT_OPERATION];
  if (!isArray(operations) || !operations.length) {
    console.warn('operations is not defined, will use [ "count" ] directly.');
    operations = DEFAULT_OPERATIONS;
    outputNames = operations;
  }
  if (!(operations.length === 1 && operations[0] === DEFAULT_OPERATION)) {
    if (operations.length !== fields.length) {
      throw new TypeError("Invalid operations: it's length must be the same as fields!");
    }
    if (outputNames.length !== fields.length) {
      throw new TypeError("Invalid as: it's length must be the same as fields!");
    }
  }
  const groups = partition(dataView.rows, options.groupBy);
  const results: any[] = [];
  forIn(groups, (group) => {
    const result = group[0];
    operations.forEach((operation, i) => {
      const outputName = outputNames[i];
      const field = fields[i];
      result[outputName] = aggregates[operation](group, field);
    });
    results.push(result);
  });
  dataView.rows = results;
}

registerTransform('aggregate', transform);
registerTransform('summary', transform);

export default {
  VALID_AGGREGATES: keys(aggregates),
};
