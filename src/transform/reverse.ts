import { DataSet } from '../data-set';
import { View } from '../view';

DataSet.registerTransform('reverse', (dataView: View) => {
  dataView.rows.reverse();
});
