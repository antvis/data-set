import { View } from '../view';
import { getColumnName } from './default';

/*
 * options: {
 *   type: 'sort',
 *   callback,
 * }
 */

export interface Options {
  callback?(a: any, b: any): number;
}

const sort = (items: View['rows'], options: Options): any[] => {
  const rows = [...(items || [])];
  const columnName = getColumnName(rows, 0);
  rows.sort(options.callback || ((a, b) => a[columnName] - b[columnName]));
  return rows;
};

const sortTransform = (dataView: View, options: Options): void => {
  dataView.rows = sort(dataView.rows, options);
};

export { sort, sortTransform };
