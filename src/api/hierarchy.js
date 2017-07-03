/* eslint-disable no-cond-assign, no-loop-func */
const assign = require('lodash/assign');
const each = require('lodash/each');
const DataView = require('../data-view');

assign(DataView.prototype, {
  ancestors(node) {
    node = node || this.root;
    return node.ancestors();
  },
  descendants(node) {
    node = node || this.root;
    return node.descendants();
  },
  leaves(node) {
    node = node || this.root;
    return node.leaves();
  },
  links(node) {
    node = node || this.root;
    return node.links();
  },
  eachNode(callback) {
    this.root.each(callback);
  },
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
        each(children, child => {
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
