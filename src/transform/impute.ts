import { assign, forIn, has, isFunction, isUndefined, isString } from '@antv/util';
import * as simpleStatistics from 'simple-statistics';
import partition from '../util/partition';
import { DataSet } from '../data-set';
import { getField } from '../util/option-parser';
import { View } from '../view';

const DEFAULT_OPTIONS: Partial<Options> = {
  // field: '', // required
  // method: 'value', // required
  // value: 10, // required if (method === 'value')
  groupBy: [],
};

function notUndefinedValues(values: any[]): any[] {
  return values.filter((value) => !isUndefined(value));
}

export interface Options {
  field: string;
  method: keyof Imputations | ((row: any, values: any[], value: any, group: any[]) => any);
  value?: any;
  groupBy?: string | string[] | ((item: any) => string);
}

const STATISTICS_METHODS = ['mean', 'median', 'max', 'min'];

interface Imputations {
  mean(row: any, values: any[]): number;
  median(row: any, values: any[]): number;
  max(row: any, values: any[]): number;
  min(row: any, values: any[]): number;
  value(row: any, values: any[], value: any): any;
}

const imputations = {} as Imputations;

STATISTICS_METHODS.forEach((method) => {
  // @ts-ignore
  imputations[method] = (row, values) => simpleStatistics[method](values);
});

imputations.value = (_row, _values, value) => value;

function transform(dataView: View, options: Options): void {
  options = assign({} as Options, DEFAULT_OPTIONS, options);
  const field = getField(options);
  const method = options.method;
  if (!method) {
    throw new TypeError('Invalid method!');
  }
  if (method === 'value' && !has(options, 'value')) {
    throw new TypeError('Invalid value: it is nil.');
  }
  const column = notUndefinedValues(dataView.getColumn(field));
  const groups = partition(dataView.rows, options.groupBy);
  forIn(groups, (group: any[]) => {
    let fieldValues = notUndefinedValues(group.map((row) => row[field]));
    if (fieldValues.length === 0) {
      fieldValues = column;
    }
    group.forEach((row: any) => {
      if (isUndefined(row[field])) {
        if (isFunction(method)) {
          row[field] = method(row, fieldValues, options.value, group);
        } else if (isString(method)) {
          row[field] = imputations[method](row, fieldValues, options.value);
        } else {
          throw new TypeError(`Invalid method: must be a function or one of ${STATISTICS_METHODS.join(', ')}`);
        }
      }
    });
  });
}

DataSet.registerTransform('impute', transform);
