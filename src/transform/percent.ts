import { assign, forIn, isArray, isString } from '@antv/util';
import { sum } from 'simple-statistics';
import partition from '../util/partition';
import { DataSet } from '../data-set';
import { getField } from '../util/option-parser';
import { View } from '../view';

const DEFAULT_OPTIONS: Partial<Options> = {
  // field: 'y', // required
  // dimension: 'x', // required
  groupBy: [], // optional
  as: '_percent',
};

export interface Options {
  field: string;
  dimension: string;
  groupBy?: string[];
  as?: string;
}

function transform(dataView: View, options: Options): void {
  options = assign({} as Options, DEFAULT_OPTIONS, options);
  const field = getField(options);
  const { dimension, groupBy } = options;
  let as = options.as;
  if (!isString(dimension)) {
    throw new TypeError('Invalid dimension: must be a string!');
  }
  if (isArray(as)) {
    console.warn('Invalid as: must be a string, will use the first element of the array specified.');
    as = as[0];
  }
  if (!isString(as)) {
    throw new TypeError('Invalid as: must be a string!');
  }
  const rows = dataView.rows;
  const result: any[] = [];
  const groups = partition(rows, groupBy);
  forIn(groups, (group) => {
    const totalSum = sum(group.map((row: any) => row[field]));
    const innerGroups = partition(group, [dimension]);
    forIn(innerGroups, (innerGroup) => {
      const innerSum = sum(innerGroup.map((row: any) => row[field]));
      // const resultRow = pick(innerGroup[0], union(groupBy, [ dimension ]));
      const resultRow = innerGroup[0];
      // FIXME in case dimension and field is the same
      const dimensionValue = resultRow[dimension];
      resultRow[field] = innerSum;
      resultRow[dimension] = dimensionValue;
      if (totalSum === 0) {
        resultRow[as!] = 0;
      } else {
        resultRow[as!] = innerSum / totalSum;
      }
      result.push(resultRow);
    });
  });
  dataView.rows = result;
}

DataSet.registerTransform('percent', transform);
