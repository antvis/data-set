import { DataSet } from '../data-set';
import { View } from '../view';

DataSet.registerTransform('default', (dataView: View) => {
  return dataView;
});
