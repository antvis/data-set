const TreeLayout = require('./layout/base');
const dendrogram = require('./layout/dendrogram');
const doTreeLayout = require('./layout/do-layout');
const assign = require('lodash/assign');
// const isArray = require('lodash/isArray');
const {
  HIERARCHY,
  registerTransform
} = require('../../data-set');

class DendrogramLayout extends TreeLayout {
  execute() {
    const me = this;
    me.rootNode.width = 0;
    const root = doTreeLayout(me.rootNode, me.options, dendrogram);
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

  const rootNode = new DendrogramLayout(root, options).execute();
  dataView.root = rootNode;
}

registerTransform('hierarchy.dendrogram', transform);
registerTransform('dendrogram', transform);
