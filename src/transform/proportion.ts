import { assign, isArray, forIn, isString } from '@antv/util';
import partition from '../util/partition';
import { DataSet } from '../data-set';
import { getField } from '../util/option-parser';
import { View } from '../view';

const DEFAULT_OPTIONS: Partial<Options> = {
  // field: 'y', // required
  // dimension: 'x', // required
  groupBy: [], // optional
  as: '_proportion',
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
  const dimension = options.dimension;
  const groupBy = options.groupBy;
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
  const result: any = [];
  const groups = partition(rows, groupBy);
  forIn(groups, (group) => {
    const totalCount = group.length;
    const innerGroups = partition(group, [dimension]);
    forIn(innerGroups, (innerGroup) => {
      const innerCount = innerGroup.length;
      // const resultRow = pick(innerGroup[0], union(groupBy, [ dimension ]));
      const resultRow = innerGroup[0];
      // FIXME in case dimension and field is the same
      const dimensionValue = resultRow[dimension];
      resultRow[field] = innerCount;
      resultRow[dimension] = dimensionValue;
      resultRow[as] = innerCount / totalCount;
      result.push(resultRow);
    });
  });
  dataView.rows = result;
}

DataSet.registerTransform('proportion', transform);
