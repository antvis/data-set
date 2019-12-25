import { DataSet } from '../data-set';
import { getFields } from '../util/option-parser';
import { View } from '../view';

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

DataSet.registerTransform('subset', (dataView: View, options: Options) => {
  const startIndex = options.startRowIndex || 0;
  const endIndex = options.endRowIndex || dataView.rows.length - 1;
  const columns = getFields(options, dataView.getColumnNames());
  dataView.rows = dataView.getSubset(startIndex, endIndex, columns);
});
