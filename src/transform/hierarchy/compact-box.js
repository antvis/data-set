const TreeLayout = require('./layout/base');
const nonLayeredTidyTree = require('./layout/non-layered-tidy');
const doTreeLayout = require('./layout/do-layout');
const assign = require('lodash/assign');
// const isArray = require('lodash/isArray');
const {
  HIERARCHY,
  registerTransform
} = require('../../data-set');

class CompactBoxTreeLayout extends TreeLayout {
  execute() {
    const me = this;
    const root = doTreeLayout(me.rootNode, me.options, nonLayeredTidyTree);
    root.translate(-(root.x + root.width / 2 + root.hgap), -(root.y + root.height / 2 + root.vgap));
    return root;
  }
}

const DEFAULT_OPTIONS = {
};

function transform(dataView, options) {
  const root = dataView.root;
  options = assign({}, DEFAULT_OPTIONS, options);

  if (dataView.dataType !== HIERARCHY) {
    throw new TypeError('Invalid DataView: This transform is for Hierarchy data only!');
  }

  const rootNode = new CompactBoxTreeLayout(root, options).execute();
  dataView.root = rootNode;
}

registerTransform('hierarchy.compact-box', transform);
registerTransform('compact-box-tree', transform);
registerTransform('non-layered-tidy-tree', transform);
registerTransform('mindmap-logical', transform);
