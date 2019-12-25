import { isArray, sortBy } from '@antv/util';
import { DataSet } from '../data-set';
import { getFields } from '../util/option-parser';
import { View } from '../view';

/*
 * options: {
 *   type: 'sort-by',
 *   fields: [],
 *   order: 'ASC' // 'DESC'
 * }
 */

const VALID_ORDERS = ['ASC', 'DESC'];

export interface Options {
  fields?: string[];
  order?: 'ASC' | 'DESC';
}

function transform(dataView: View, options: Options): void {
  const fields = getFields(options, [dataView.getColumnName(0)]);
  if (!isArray(fields)) {
    throw new TypeError('Invalid fields: must be an array with strings!');
  }
  dataView.rows = sortBy(dataView.rows, fields);
  const order = options.order;
  if (order && VALID_ORDERS.indexOf(order) === -1) {
    throw new TypeError(`Invalid order: ${order} must be one of ${VALID_ORDERS.join(', ')}`);
  } else if (order === 'DESC') {
    dataView.rows.reverse();
  }
}

DataSet.registerTransform('sort-by', transform);
DataSet.registerTransform('sortBy', transform);
