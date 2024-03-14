import { pick as pickUtil } from '@antv/util';
import { getFields } from '../util/option-parser';
import { View } from '../view';
import { getColumnNames } from './default';

/*
 * options: {
 *   type: 'pick',
 *   fields: [],
 * }
 */

export interface Options {
  fields?: string[];
}

const pick = (rows: View['rows'], options: Options): any[] => {
  const cloned = [...(rows || [])];
  const columns = getFields(options, getColumnNames(rows));

  return cloned.map((row) => pickUtil(row, columns));
};

const pickTransform = (dataView: View, options: Options): void => {
  dataView.rows = pick(dataView.rows, options);
};

export { pick, pickTransform };
