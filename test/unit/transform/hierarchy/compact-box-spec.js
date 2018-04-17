const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../../src/index');
const flare = require('../../../fixtures/flare.json');

describe('View.transform(): hierarchy.compact-box', () => {
  const ds = new DataSet();
  let dv;
  beforeEach(() => {
    dv = ds.createView();
  });

  it('api', () => {
    expect(getTransform('hierarchy.compact-box')).to.be.a('function');
    expect(getTransform('compact-box-tree')).to.be.a('function');
    expect(getTransform('non-layered-tidy-tree')).to.be.a('function');
    expect(getTransform('mindmap-logical')).to.be.a('function');
  });

  it('default', () => {
    expect(() => {
      dv.transform({
        type: 'hierarchy.compact-box'
      });
    }).to.throw();
    expect(() => {
      dv.source(flare, {
        type: 'hierarchy'
      }).transform({
        type: 'hierarchy.compact-box'
      });
    }).to.not.throw();
  });

  it('default layout', () => {
    dv.source(flare, {
      type: 'hierarchy'
    }).transform({
      type: 'hierarchy.compact-box'
    });
    const root = dv.root;
    expect(root.x).to.be.a('number');
    expect(root.y).to.be.a('number');
    expect(root.width).to.be.a('number');
    expect(root.height).to.be.a('number');
  });

  it('mindmap horizontal layout', () => {
    dv.source(flare, {
      type: 'hierarchy'
    }).transform({
      type: 'hierarchy.compact-box',
      direction: 'H'
    });
    const root = dv.root;
    const children = root.children;
    expect(children[0].side).to.equal('right');
    expect(children[children.length - 1].side).to.equal('left');
  });

  it('mindmap horizontal layout: getSide', () => {
    dv.source(flare, {
      type: 'hierarchy'
    }).transform({
      type: 'hierarchy.compact-box', // compact-box-tree, non-layered-tidy-tree, mindmap-logical
      direction: 'H',
      getSide(child, index) {
        if (index) {
          return 'left';
        }
        return 'right';
      }
    });
    const root = dv.root;
    const children = root.children;
    expect(children[0].side).to.equal('right');
    for (let i = 1; i < children.length; i++) {
      expect(children[i].side).to.equal('left');
    }
  });
});
