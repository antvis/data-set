import { assign } from '@antv/util';
import { View } from '../view';

assign(View.prototype, {
  getAllNodes(this: View) {
    const nodes: any[] = [];
    const root = this.root;
    if (root && root.each) {
      // d3-hierarchy
      root.each((node: any) => {
        nodes.push(node);
      });
    } else if (root && root.eachNode) {
      // @antv/hierarchy
      root.eachNode((node: any) => {
        nodes.push(node);
      });
    }
    return nodes;
  },
  getAllLinks(this: View) {
    const links: any[] = [];
    const nodes: any[] = [this.root];
    let node: any;
    while ((node = nodes.pop())) {
      const children = node.children;
      if (children) {
        children.forEach((child: any) => {
          links.push({
            source: node,
            target: child,
          });
          nodes.push(child);
        });
      }
    }
    return links;
  },
});

assign(View.prototype, {
  getAllEdges: View.prototype.getAllLinks,
});

export interface HierarchyApi {
  root?: any;
  getAllNodes(): any[];
  getAllLinks(): any[];
  getAllEdges(): any[];
}
