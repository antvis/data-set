import { isArray, sortBy as sortByUtil } from '@antv/util';
import { getFields } from '../util/option-parser';
import { View } from '../view';
import { getColumnName } from './default';

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
const sortBy = (items: View['rows'], options: Options): any[] => {
  let rows = [...(items || [])];
  const fields = getFields(options, [getColumnName(rows, 0)]);
  if (!isArray(fields)) {
    throw new TypeError('Invalid fields: must be an array with strings!');
  }
  rows = sortByUtil(rows, fields);
  const order = options.order;
  if (order && VALID_ORDERS.indexOf(order) === -1) {
    throw new TypeError(`Invalid order: ${order} must be one of ${VALID_ORDERS.join(', ')}`);
  } else if (order === 'DESC') {
    rows.reverse();
  }

  return rows;
};

function sortByTransform(dataView: View, options: Options): void {
  dataView.rows = sortBy(dataView.rows, options);
}

export { sortBy, sortByTransform };
