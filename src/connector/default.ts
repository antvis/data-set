import { isString, deepMix } from '@antv/util';
import DataSet from '../data-set';
import { View } from '../view';

DataSet.registerConnector('default', (dataView: string | View, dataSet: DataSet) => {
  let view: View | undefined;

  if (isString(dataView)) {
    view = dataSet.getView(dataView);
  } else {
    view = dataView;
  }

  if (!view) {
    throw new TypeError('Invalid dataView');
  }
  return deepMix([], view.rows);
});
