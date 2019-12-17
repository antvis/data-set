import DataSet from '../data-set';
import { View } from '../view';
const { registerTransform } = DataSet;

/*
 * options: {
 *   type: 'reverse',
 * }
 */

registerTransform('reverse', (dataView: View) => {
  dataView.rows.reverse();
});
