import { assign, forIn, isArray, isString } from '@antv/util';
import { quantile as _quantile } from 'simple-statistics';
import partition from '../../util/partition';
import pByFraction from '../../util/p-by-fraction';
import { getField } from '../../util/option-parser';
import { View } from '../../view';

const DEFAULT_OPTIONS: Partial<Options> = {
  as: '_bin',
  groupBy: [], // optional
  fraction: 4, // default
  // p: [0.5, 0.3], // array of p parameter
  // field: 'y', // required
};
export interface Options {
  as?: string;
  groupBy?: string[];
  fraction?: number;
  p?: number[];
  field: string;
}

const quantile = (items: View['rows'], options: Options): any[] => {
  const rows = [...(items || [])];
  options = assign({} as Options, DEFAULT_OPTIONS, options);
  const field = getField(options);
  const as = options.as;
  if (!isString(as)) {
    throw new TypeError('Invalid as: it must be a string (e.g. "_bin")!');
  }
  let pArray = options.p;
  const fraction = options.fraction;
  if (!isArray(pArray) || pArray.length === 0) {
    pArray = pByFraction(fraction);
  }
  const groupBy = options.groupBy;
  const groups: Record<string, any[]> = partition(rows, groupBy);
  const result: any[] = [];
  forIn(groups, (group: any[]) => {
    // const resultRow = pick(group[0], groupBy);
    const resultRow = group[0];
    const binningColumn = group.map((row) => row[field]);
    const quantiles = pArray.map((p) => _quantile(binningColumn, p));
    resultRow[as] = quantiles;
    result.push(resultRow);
  });
  return result;
};

function quantileTransform(dataView: View, options: Options): void {
  dataView.rows = quantile(dataView.rows, options);
}

export { quantile, quantileTransform };
