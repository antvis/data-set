import { pick } from '@antv/util';
import { DataSet } from '../data-set';
import { getFields } from '../util/option-parser';
import { View } from '../view';

/*
 * options: {
 *   type: 'pick',
 *   fields: [],
 * }
 */

export interface Options {
  fields?: string[];
}

DataSet.registerTransform('pick', (dataView: View, options: Options) => {
  const columns = getFields(options, dataView.getColumnNames());
  dataView.rows = dataView.rows.map((row) => pick(row, columns));
});
