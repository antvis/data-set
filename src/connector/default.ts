import { isString, deepMix } from '@antv/util';
import { DataSet } from '../data-set';
import { View } from '../view';

function defaultConnector(data: string | View, dataSet: DataSet): any {
  let view: View | undefined;

  if (isString(data)) {
    view = dataSet.getView(data);
  } else {
    view = data;
  }

  if (!view) {
    throw new TypeError('Invalid dataView');
  }
  return deepMix([], view.rows);
}

export default defaultConnector;
