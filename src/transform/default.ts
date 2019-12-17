import DataSet from '../data-set';
import { View } from '../view';
const { registerTransform } = DataSet;

registerTransform('default', (dataView: View) => {
  return dataView;
});
