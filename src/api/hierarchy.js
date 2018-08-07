/* eslint-disable no-cond-assign, no-loop-func */
const assign = require('@antv/util/lib/mix');
const View = require('../view');

assign(View.prototype, {
  getAllNodes() {
    const nodes = [];
    this.root.each(node => {
      nodes.push(node);
    });
    return nodes;
  },
  getAllLinks() {
    const links = [];
    const nodes = [ this.root ];
    let node;
    while (node = nodes.pop()) {
      const children = node.children;
      if (children) {
        children.forEach(child => {
          links.push({
            source: node,
            target: child
          });
          nodes.push(child);
        });
      }
    }
    return links;
  }
});

assign(View.prototype, {
  getAllEdges: View.prototype.getAllLinks
});
