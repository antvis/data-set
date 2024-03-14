import DataSet from '../../../../src';
import flare from '../../../fixtures/flare.json';
import { View } from '../../../../src/view';
const { getTransform } = DataSet;

describe('View.transform(): hierarchy.compact-box', () => {
  const ds = new DataSet();
  let dv: View;
  beforeEach(() => {
    dv = ds.createView();
  });

  it('api', () => {
    expect(typeof getTransform('hierarchy.compact-box')).toBe('function');
    expect(typeof getTransform('compact-box-tree')).toBe('function');
    expect(typeof getTransform('non-layered-tidy-tree')).toBe('function');
    expect(typeof getTransform('mindmap-logical')).toBe('function');
  });

  it('default', () => {
    expect(() => {
      dv.transform({
        type: 'hierarchy.compact-box',
      });
    }).toThrow();
    expect(() => {
      dv.source(flare, {
        type: 'hierarchy',
      }).transform({
        type: 'hierarchy.compact-box',
      });
    }).not.toThrow();
  });

  it('default layout', () => {
    dv.source(flare, {
      type: 'hierarchy',
    }).transform({
      type: 'hierarchy.compact-box',
    });
    const root = dv.root;
    expect(typeof root.x).toBe('number');
    expect(typeof root.y).toBe('number');
    expect(typeof root.width).toBe('number');
    expect(typeof root.height).toBe('number');
  });

  it('mindmap horizontal layout', () => {
    dv.source(flare, {
      type: 'hierarchy',
    }).transform({
      type: 'hierarchy.compact-box',
      direction: 'H',
    });
    const root = dv.root;
    const children = root.children;
    expect(children[0].side).toEqual('right');
    expect(children[children.length - 1].side).toEqual('left');
  });

  it('mindmap horizontal layout: getSide', () => {
    dv.source(flare, {
      type: 'hierarchy',
    }).transform({
      type: 'hierarchy.compact-box', // compact-box-tree, non-layered-tidy-tree, mindmap-logical
      direction: 'H',
      getSide(child, index) {
        if (index) {
          return 'left';
        }
        return 'right';
      },
    });
    const root = dv.root;
    const children = root.children;
    expect(children[0].side).toEqual('right');
    for (let i = 1; i < children.length; i++) {
      expect(children[i].side).toEqual('left');
    }
  });
});
