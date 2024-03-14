import hierarchy from '@antv/hierarchy';
import { DataSet } from '../../data-set';
import { View } from '../../view';

const DEFAULT_OPTIONS = {};

function indentedTransform(dataView: View, options) {
  const root = dataView.root;
  options = Object.assign({}, DEFAULT_OPTIONS, options);

  if (dataView.dataType !== DataSet.CONSTANTS.HIERARCHY) {
    throw new TypeError('Invalid DataView: This transform is for Hierarchy data only!');
  }

  dataView.root = hierarchy.indented(root, options);
}

export { indentedTransform };
