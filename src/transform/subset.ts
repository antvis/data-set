import { getFields } from '../util/option-parser';
import { View } from '../view';
import { getColumnNames, getSubset } from './default';

/*
 * options: {
 *   type: 'subset',
 *   startRowIndex: 0,
 *   endRowIndex: 1,
 *   fields: [],
 * }
 */

export interface Options {
  startRowIndex?: number;
  endRowIndex?: number;
  fields?: string[];
}

const subset = (items: View['rows'], options: Options): any[] => {
  const rows = [...(items || [])];
  const startIndex = options.startRowIndex || 0;
  const endIndex = options.endRowIndex || rows.length - 1;
  const columns = getFields(options, getColumnNames(rows));

  return getSubset(rows, startIndex, endIndex, columns);
};

const subsetTransform = (dataView: View, options: Options): void => {
  dataView.rows = subset(dataView.rows, options);
};
export { subset, subsetTransform };
